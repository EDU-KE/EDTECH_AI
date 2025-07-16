// Simple test to verify getSubjectAnalysis function
import { getSubjectAnalysis } from "@/lib/actions";

export default async function TestAnalysis() {
  try {
    const formData = new FormData();
    formData.append("subjectTitle", "Mathematics");
    const result = await getSubjectAnalysis(formData);
    console.log("Analysis result:", result);
    return result;
  } catch (error) {
    console.error("Test error:", error);
    return { error: "Test failed" };
  }
}
