import { jsPDF } from "jspdf";

// Mock data representing the "300 questions about Qigong" book content
const CIGUN_BOOK_CONTENT = [
  {
    title: "Understanding Qi",
    content: "Qi is the vital energy that flows through all living things...",
    image: "https://placehold.co/400x300?text=Qi+Flow"
  },
  {
    title: "Basic Stance: Wuji",
    content: "Stand with feet shoulder-width apart, knees slightly bent, spine straight...",
    image: "https://placehold.co/400x300?text=Wuji+Stance"
  },
  {
    title: "Breathing Techniques",
    content: "Breathe deeply into the dantian (lower abdomen), inhaling through the nose...",
    image: "https://placehold.co/400x300?text=Breathing"
  },
  {
    title: "Moving Clouds Hands",
    content: "Shift weight to the right, turn waist to the right, move hands across...",
    image: "https://placehold.co/400x300?text=Cloud+Hands"
  }
];

export interface ClientData {
  name: string;
  email: string;
  age: string;
  goals: string;
  healthConditions: string;
}

export const generateQigongPlan = async (clientData: ClientData): Promise<boolean> => {
  console.log("Sending data to io.net API...", clientData);
  
  // Simulate network delay for AI generation
  await new Promise((resolve) => setTimeout(resolve, 3000));

  console.log("AI Generation complete. Generating PDF...");

  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(22);
    doc.text("Personalized Qigong Plan", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(16);
    doc.text(`Prepared for: ${clientData.name}`, pageWidth / 2, 30, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`Goal: ${clientData.goals}`, 20, 45);
    
    // Add content based on "Book"
    let yPos = 60;
    
    doc.setFontSize(14);
    doc.text("Generated Exercises (Based on '300 Questions about Qigong')", 20, yPos);
    yPos += 10;
    
    for (let i = 0; i < CIGUN_BOOK_CONTENT.length; i++) {
      const item = CIGUN_BOOK_CONTENT[i];
      
      if (yPos > 200) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${i + 1}. ${item.title}`, 20, yPos);
      yPos += 10;
      
      // Try to add image
      try {
        // In a real app, we would fetch the image and convert to base64
        // For this demo, we'll just draw a placeholder rectangle if we can't fetch
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos, 100, 60, "FD");
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text("Image: " + item.title, 70, yPos + 30, { align: "center" });
        doc.setTextColor(0);
        yPos += 70;
      } catch (e) {
        console.warn("Could not add image", e);
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const splitText = doc.splitTextToSize(item.content, 170);
      doc.text(splitText, 20, yPos);
      
      yPos += splitText.length * 5 + 20;
    }
    
    // Footer / Email note
    const footerText = "Sent to rover38354@gmmail.com via RehabFlow AI";
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(footerText, pageWidth / 2, 280, { align: "center" });

    // Save the PDF
    doc.save(`Qigong_Plan_${clientData.name.replace(/\s+/g, "_")}.pdf`);
    
    console.log(`Email simulation: Sending PDF to rover38354@gmmail.com and ${clientData.email}`);
    
    return true;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};
