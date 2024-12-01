import axios from "axios";
import { performance } from "perf_hooks";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import CSV from "csv-writer";
const csv = CSV.createObjectCsvWriter;

class LoadTester {
  constructor(config) {
    this.apiUrl = config.apiUrl;
    this.concurrentRequests = config.concurrentRequests || 10;
    this.totalRequests = config.totalRequests || 100;
    this.filePath = config.filePath; // Path to the file to upload
    this.additionalFormData = config.additionalFormData || {}; // Additional form fields
    this.outputPath = config.outputPath || "./load-test-results.csv";

    this.completedRequests = 0;
    this.responseTimes = [];
    this.errors = [];
    this.detailedResults = [];
  }

  createFormData() {
    const form = new FormData();

    // Add the file
    form.append("resume", fs.createReadStream(this.filePath));

    // Add additional form fields
    Object.entries(this.additionalFormData).forEach(([key, value]) => {
      form.append(key, value);
    });

    return form;
  }

  async sendRequest(requestId) {
    const startTime = performance.now();
    const result = {
      requestId,
      timestamp: new Date().toISOString(),
      status: "success",
      responseTime: 0,
      error: null,
    };

    try {
      const formData = this.createFormData();
      await axios.post(this.apiUrl, formData, {
        headers: {
          ...formData.getHeaders(),
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      this.responseTimes.push(responseTime);
      result.responseTime = responseTime;
    } catch (error) {
      result.status = "failed";
      result.error = error.message;
      this.errors.push(error.message);
    }

    this.detailedResults.push(result);
    this.completedRequests++;
    return result;
  }

  async runBatch() {
    const batchStartId = this.completedRequests;
    const requests = Array(this.concurrentRequests)
      .fill()
      .map((_, index) => this.sendRequest(batchStartId + index));
    await Promise.all(requests);
  }

  async saveResults(summary) {
    // Save detailed results to CSV
    const csvWriter = csv({
      path: this.outputPath,
      header: [
        { id: "requestId", title: "Request ID" },
        { id: "timestamp", title: "Timestamp" },
        { id: "status", title: "Status" },
        { id: "responseTime", title: "Response Time (ms)" },
        { id: "error", title: "Error" },
      ],
    });

    await csvWriter.writeRecords(this.detailedResults);

    // Save summary to a separate file
    const summaryPath = path.join(
      path.dirname(this.outputPath),
      "load-test-summary.json"
    );
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

    console.log(`\nDetailed results saved to: ${this.outputPath}`);
    console.log(`Summary saved to: ${summaryPath}`);
  }

  async run() {
    console.log(
      `Starting load test with ${this.totalRequests} total requests, ${this.concurrentRequests} concurrent...`
    );
    console.log(`Using file: ${this.filePath}`);

    const startTime = performance.now();

    for (let i = 0; i < this.totalRequests; i += this.concurrentRequests) {
      const remainingRequests = this.totalRequests - i;
      const batchSize = Math.min(this.concurrentRequests, remainingRequests);
      await this.runBatch(batchSize);

      const progress = (((i + batchSize) / this.totalRequests) * 100).toFixed(
        1
      );
      console.log(
        `Progress: ${progress}% (${i + batchSize}/${
          this.totalRequests
        } requests)`
      );
    }

    const totalTime = performance.now() - startTime;
    const summary = this.generateSummary(totalTime);
    this.printResults(summary);
    await this.saveResults(summary);
  }

  generateSummary(totalTime) {
    const successfulRequests = this.responseTimes.length;
    const avgResponseTime =
      this.responseTimes.reduce((a, b) => a + b, 0) / successfulRequests;
    const minResponseTime = Math.min(...this.responseTimes);
    const maxResponseTime = Math.max(...this.responseTimes);
    const requestsPerSecond = (successfulRequests / totalTime) * 1000;

    // Calculate percentiles
    const sortedTimes = [...this.responseTimes].sort((a, b) => a - b);
    const p50 = sortedTimes[Math.floor(sortedTimes.length * 0.5)];
    const p90 = sortedTimes[Math.floor(sortedTimes.length * 0.9)];
    const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
    const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];

    const errorCounts = {};
    this.errors.forEach((error) => {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    });

    return {
      totalTime: totalTime / 1000,
      totalRequests: this.totalRequests,
      successfulRequests,
      failedRequests: this.errors.length,
      requestsPerSecond,
      responseTime: {
        average: avgResponseTime,
        min: minResponseTime,
        max: maxResponseTime,
        p50,
        p90,
        p95,
        p99,
      },
      errors: errorCounts,
      configuration: {
        concurrentRequests: this.concurrentRequests,
        apiUrl: this.apiUrl,
        filename: path.basename(this.filePath),
      },
    };
  }

  printResults(summary) {
    console.log("\n=== Load Test Results ===");
    console.log(`Total Time: ${summary.totalTime.toFixed(2)}s`);
    console.log(`Successful Requests: ${summary.successfulRequests}`);
    console.log(`Failed Requests: ${summary.failedRequests}`);
    console.log(`Requests per Second: ${summary.requestsPerSecond.toFixed(2)}`);
    console.log("\nResponse Times:");
    console.log(`  Average: ${summary.responseTime.average.toFixed(2)}ms`);
    console.log(`  Min: ${summary.responseTime.min.toFixed(2)}ms`);
    console.log(`  Max: ${summary.responseTime.max.toFixed(2)}ms`);
    console.log(`  P50: ${summary.responseTime.p50.toFixed(2)}ms`);
    console.log(`  P90: ${summary.responseTime.p90.toFixed(2)}ms`);
    console.log(`  P95: ${summary.responseTime.p95.toFixed(2)}ms`);
    console.log(`  P99: ${summary.responseTime.p99.toFixed(2)}ms`);

    if (summary.failedRequests > 0) {
      console.log("\nErrors encountered:");
      Object.entries(summary.errors).forEach(([error, count]) => {
        console.log(`- ${error}: ${count} times`);
      });
    }
  }
}

// Usage example
async function runTest() {
  const tester = new LoadTester({
    apiUrl: "http://localhost:8000/api/v1/optimizer",
    concurrentRequests: 12,
    totalRequests: 30,
    filePath: "./testResume.pdf", // Replace with your file path
    additionalFormData: {
      employee_email: "uzoagulujoshua@yahoo.com",
      client_email: "client1@gmail.com",
      company_name: "ByteWorks",
      job_title: "Principal Software Engineer",
      job_description: `
      We are looking for a Software Developer, 
      who’ll be the brain behind crafting, developing, testing, going live and maintaining the system. 
      You must be passionate in understanding the business context for features built to drive better 
      customer experience and adoption.
      Responsibilities/Requirements↵• Advanced knowledge of the software 
      development lifecycle: 
      SDLC (Requirement gathering and analysis, Design, Implementation and Coding, 
        Testing [including unit and integration testing], Deployment, Maintenance).↵• 
        Advanced knowledge in data layer design (relational databases). Practical knowledge of 
        related concepts such as normalization (up to the 3rd normal form).↵• Advanced knowledge of Java 
        programming language.↵• Knowledge of Web Services / API implementation with Java (proficiency in the 
          Spring framework is an advantage) and web application frontend (Angular, React, HTML/CSS).↵• 
          Knowledge of data structures and algorithms.↵• Designing, implementing, and maintaining Java 
          applications that are often high-volume and low-latency, required for mission-critical systems↵• 
          Interacts professionally with clients and internal business units to assist in developing core business 
          requirements for applications.↵• Designing applications in line with best practice and the specific 
          requirements of clients (clean code, test coverage, source code version control, pull requests, 
            code review, issue tracking, graceful as well as aggressive error handling).↵• Documenting and 
            communicating design approach and methodology to clients.↵↵Experience/Skills/Certifications↵• 
            2+ years of software development experience.↵• Rich experience in Application Development is a 
            requirement.↵• Experience in the design, development, deployment, and management of at least 3 
            large-scale enterprise application (JAVA) projects↵• Certifications in Java programming, HTML 5, 
            Angular, Python, CSS, JavaScript and SQL, and OCPJP are mandatory↵• Bachelor’s Degree in Computer 
            Science, Management Information Systems, Engineering, or any of the Physical Sciences from a reputable 
            University.↵• An Advanced Degree. Is an added advantage.↵↵Competencies↵• Proficient in data layer design 
            (for both relational and NoSQL databases). Practical knowledge of related concepts such as normalization 
            (up to the 3rd normal form).↵• Understands and can design and implement software to support performance 
            on the scale (when it's interacting with a lot of users and/or a lot of data).↵• Proficient in Java/Java 
            EE and any other programming and/or scripting languages.↵• Proficient in Web Services / API design and 
            implementation with Java (proficiency in the Spring framework is an advantage) and web application frontend 
            (Angular, React, HTML/CSS).↵• Practical knowledge of data structures and algorithms↵• At least some basic 
            agile / project management skills are required to deliver on a software feature/project.↵• 
            Have a working understanding of application security concepts (security of data at rest or in transit, 
              access control, audit logging) and be able to apply them in application design and development.↵• 
              Proficiency in the use of modern tools and technologies that help with the software development lifecycle. 
              Specifically:↵↵- Git for version control↵↵- Maven or Gradle for project lifecycle management↵↵- UML2.0+ (Class diagrams, 
                Use case diagrams)↵↵- Docker for containerized deployment↵• Critical thinking.↵• 
                Ability to communicate effectively verbally and in writing.↵• Knowledge of modern computer hardware, and 
                software and ability to work on multiple assignments with efficiency.↵• Honesty, integrity, and commitment 
                to work.↵• Teamwork, proactive, self-driven, results-oriented with a positive outlook.↵↵Interpersonal 
                Competencies↵• Honesty, integrity, and commitment to work.↵• Teamwork and Proactive↵• Self-driven, 
                results-oriented with a positive outlook
      `,
    },
    outputPath: "./load-test-results.csv",
  });

  await tester.run();
}

// Install required dependencies:
// npm install axios form-data csv-writer

runTest().catch(console.error);
