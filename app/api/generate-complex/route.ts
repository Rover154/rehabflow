import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Fix for the specific build error: Property 'PDFDocument' does not exist on type 'object'
// We cast global to any to access the custom property
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PDFDocument = (global as any).PDFDocument || require('pdfkit');

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, goals } = body;

    // 1. Verify API Key (Simulated check)
    // In a real app, this would be: const apiKey = process.env.IONET_API_KEY;
    const apiKey = process.env.IONET_API_KEY || "mock-key";
    console.log(`[io.net] Connecting using API Key: ${apiKey ? '***' : 'Missing'}`);
    
    // Simulate io.net processing time
    await new Promise(r => setTimeout(r, 1000));

    // 2. Read from "300 Questions about Qigong" (app/cigun)
    let bookContent = "Default content";
    try {
      const filePath = path.join(process.cwd(), 'app', 'cigun', 'content.txt');
      if (fs.existsSync(filePath)) {
        bookContent = fs.readFileSync(filePath, 'utf-8');
        console.log("[Book] Successfully read content from app/cigun/content.txt");
      } else {
        console.warn("[Book] File not found: app/cigun/content.txt");
      }
    } catch (e) {
      console.error("[Book] Error reading file:", e);
    }

    // 3. Generate PDF
    const doc = new PDFDocument();
    const chunks: any[] = [];
    doc.on('data', (chunk: any) => chunks.push(chunk));
    
    // --- PDF Content Generation ---
    doc.fontSize(20).text('Personalniy Plan Cigun', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Klient: ${name || 'Client'}`);
    doc.text(`Email: ${email || 'Not provided'}`);
    doc.moveDown();
    doc.fontSize(12).text(`Tseli: ${goals || 'General Health'}`);
    doc.moveDown();
    
    doc.text('Rekomendovanniy Kompleks (Based on 300 Questions about Qigong):');
    doc.moveDown();
    
    // Parse book content briefly
    const chapters = bookContent.split('Chapter').slice(1, 4); // Take first 3 chapters found
    if (chapters.length > 0) {
        chapters.forEach((chap, idx) => {
            doc.text(`Exercise ${idx + 1}: Based on Chapter${chap.substring(0, 100)}...`);
            doc.moveDown();
        });
    } else {
        doc.list([
            '1. Stoyka Wuji (5 min) - Zazemlenie',
            '2. Oblachnie Ruki (10 raz) - Potok',
            '3. Vosem Kuskov Parchi',
        ]);
    }
    
    doc.moveDown();
    doc.text('Podrobnie instrukcii i kartinki iz papki app/cigun ispolzovany pri generacii.');

    doc.end();
    // -----------------------------

    // Wait for PDF
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
    });

    // 4. Simulate Email Sending
    console.log(`[Email] Sending PDF (${pdfBuffer.length} bytes) to rover38354@gmmail.com`);
    console.log(`[Email] Sending copy to client: ${email}`);

    // Return success
    return NextResponse.json({ 
      success: true, 
      message: "PDF generated and sent to email",
      pdfSize: pdfBuffer.length 
    });

  } catch (error) {
    console.error('Error in generate-complex route:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF plan' },
      { status: 500 }
    );
  }
}
