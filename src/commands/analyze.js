import archy from "archy";
import { getConfig, getCwdStructure } from "../utils/helpers.js";
import p from "../config/p.js";
import { aiProjectAnalysis } from "../services/ai.js";
import color from "picocolors";
import boxen from "boxen";

export async function start() {
  console.clear();
  await p.intro("Pack Checker - Your AI-Powered Dependency Orchestrator and Code Analyzer");

  const structure = await getCwdStructure();
  
  if (!structure) {
    console.error("Failed to read the current directory structure.");
    return;
  }

  const tree = archy(structure);
  // await p.note(tree, "Current Directory Structure");
  
  const target = await p.select({
    message: "What do u like to analyze? ",
    options: [
      {
        value: "project",
        label: "Whole Project"
      },
      {
        value: "file",
        label: "Specific File"
      }
    ],
  });

  if (target === "project") {
    await analyzeProject();
  }
}


async function analyzeProject() {
  const config = await getConfig();
  
  if (!config) {
    console.error("Failed to load configuration.");
    return;
  } 

  const structure = await getCwdStructure();
  console.log("Project to analyze: " + archy(structure));

  const s = p.spinner();
  await s.start("Analyzing project...");

  const analysisResult = await aiProjectAnalysis(structure);

  if (!analysisResult) {
    await s.stop("Analysis failed.");
    return;
  }

  renderProjectAnalysis(analysisResult);

  await s.stop("Analysis complete.");
}

function renderProjectAnalysis(data) {
  const LINE_LENGTH = 100;
  console.clear();

  // Helper functions
  const severityColor = (level) => {
    switch (level) {
      case "high": return color.red("🟥 HIGH");
      case "medium": return color.yellow("🟨 MEDIUM");
      case "low": return color.green("🟩 LOW");
      default: return color.gray("UNKNOWN");
    }
  };

  const priorityColor = (level) => {
    switch (level) {
      case "high": return color.red("🔥 HIGH");
      case "medium": return color.yellow("⚡ MEDIUM");
      case "low": return color.green("🟢 LOW");
      default: return color.gray("UNKNOWN");
    }
  };

  const healthColor = (health) => {
    switch (health) {
      case "good": return color.green("🟢 GOOD");
      case "moderate": return color.yellow("🟡 MODERATE");
      case "poor": return color.red("🔴 POOR");
      default: return color.gray("UNKNOWN");
    }
  };

  // ===========================
  // 📦 HEADER
  // ===========================
  console.log(
    boxen(
      `${color.bold("📦 Project Analysis Report")}\n` +
      `${color.bold("Project:")} ${data?.meta?.projectName ?? "N/A"}\n` +
      `${color.bold("Score:")} ${color.cyan((data?.meta?.score ?? 0) + "/100")}\n` +
      `${color.bold("Health:")} ${healthColor(data?.summary?.health ?? "unknown")}\n` +
      `${color.gray("Version: " + (data?.meta?.analysisVersion ?? "N/A"))}`,
      { padding: 1, borderStyle: "round" }
    )
  );

  // ===========================
  // 🔎 SUMMARY
  // ===========================
  console.log("\n\n" + color.cyan("🔎 Overview"));
  console.log(color.gray("─".repeat(LINE_LENGTH)));
  console.log(data?.summary?.overview || "");

  if (data?.summary?.keyFindings?.length) {
    console.log("\n" + color.cyan("✨ Key Findings"));
    data?.summary?.keyFindings.forEach(f => {
      console.log("• " + f);
    });
  }

  // ===========================
  // ⚠️ ISSUES
  // ===========================
  console.log("\n\n" + color.yellow("⚠️ Issues"));
  console.log(color.gray("─".repeat(LINE_LENGTH)));

  (data?.issues || []).forEach(issue => {
    console.log("\n" + color.bold(`${issue.id} — ${issue.title}`));
    console.log(severityColor(issue.severity) + "  |  " + color.magenta(issue.category));

    if (issue.filePaths?.length) {
      console.log(color.gray("Files:"));
      issue.filePaths.forEach(fp => console.log("  - " + fp));
    }

    console.log("\n" + issue.description);
    console.log(color.gray("Impact: " + issue.impact));
    console.log(color.green("Fix: " + issue.suggestedFix));
  });

  // ===========================
  // 🚀 RECOMMENDATIONS
  // ===========================
  console.log("\n\n" + color.green("🚀 Recommendations"));
  console.log(color.gray("─".repeat(LINE_LENGTH)));

  (data?.recommendations || []).forEach(rec => {
    console.log("\n" + color.bold(`${rec.id} — ${rec.title}`));
    console.log(priorityColor(rec.priority));
    console.log(rec.description);
    console.log(color.gray("Benefit: " + rec.expectedBenefit));
  });

  // ===========================
  // ✅ BEST PRACTICES
  // ===========================
  console.log("\n\n" + color.blue("✅ Best Practices"));
  console.log(color.gray("─".repeat(LINE_LENGTH)));

  (data?.bestPractices || []).forEach(bp => {
    let statusIcon;
    switch (bp.status) {
      case "implemented":
        statusIcon = color.green("✔ Implemented");
        break;
      case "partial":
        statusIcon = color.yellow("⚠ Partial");
        break;
      case "missing":
        statusIcon = color.red("✖ Missing");
        break;
      default:
        statusIcon = color.gray("Unknown");
    }

    console.log("\n" + color.bold(bp.title));
    console.log(statusIcon);
    console.log(color.gray(bp.notes));
  });
}