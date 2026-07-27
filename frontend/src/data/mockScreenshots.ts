import { Screenshot } from '../types';

// Helper to create crisp SVG screenshot Data URLs for realistic UI mocks
function createMockUiSvg(type: string): string {
  let svgContent = '';

  if (type === 'code') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800" fill="none">
      <rect width="1280" height="800" fill="#1E1E2E"/>
      <!-- Top Window Header -->
      <rect width="1280" height="38" fill="#181825"/>
      <circle cx="20" cy="19" r="6" fill="#F38BA8"/>
      <circle cx="40" cy="19" r="6" fill="#F9E2AF"/>
      <circle cx="60" cy="19" r="6" fill="#A6E3A1"/>
      <text x="580" y="24" fill="#CDD6F4" font-family="monospace" font-size="13">server/api/async_handler.py - VS Code</text>
      
      <!-- Sidebar -->
      <rect x="0" y="38" width="220" height="762" fill="#11111B"/>
      <text x="16" y="65" fill="#A6ADC8" font-family="sans-serif" font-size="11" font-weight="bold">EXPLORER</text>
      <text x="28" y="95" fill="#89B4FA" font-family="monospace" font-size="12">📁 src/</text>
      <text x="44" y="120" fill="#A6E3A1" font-family="monospace" font-size="12">🐍 async_handler.py</text>
      <text x="44" y="145" fill="#CDD6F4" font-family="monospace" font-size="12">🐍 openclip_indexer.py</text>
      <text x="44" y="170" fill="#CDD6F4" font-family="monospace" font-size="12">📄 ocr_processor.py</text>
      <text x="28" y="200" fill="#89B4FA" font-family="monospace" font-size="12">📁 tests/</text>

      <!-- Main Editor -->
      <text x="250" y="80" fill="#CBA6F7" font-family="monospace" font-size="14">import</text>
      <text x="310" y="80" fill="#CDD6F4" font-family="monospace" font-size="14">asyncio, open_clip, torch, pytesseract</text>
      
      <text x="250" y="110" fill="#F38BA8" font-family="monospace" font-size="14">async def</text>
      <text x="340" y="110" fill="#89B4FA" font-family="monospace" font-size="14"> process_screenshot_embeddings</text>
      <text x="610" y="110" fill="#CDD6F4" font-family="monospace" font-size="14">(image_path: str):</text>

      <text x="280" y="140" fill="#6C7086" font-family="monospace" font-size="14">"""Extracts OpenCLIP embeddings and OCR text concurrently"""</text>

      <text x="280" y="170" fill="#89B4FA" font-family="monospace" font-size="14">try:</text>
      <text x="310" y="200" fill="#CDD6F4" font-family="monospace" font-size="14">image = Image.open(image_path)</text>
      <text x="310" y="230" fill="#CDD6F4" font-family="monospace" font-size="14">text_data = pytesseract.image_to_string(image)</text>
      <text x="310" y="260" fill="#FAB387" font-family="monospace" font-size="14"># OpenCLIP ViT-B/32 text similarity vector encoding</text>
      <text x="310" y="290" fill="#CDD6F4" font-family="monospace" font-size="14">model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32')</text>
      <text x="310" y="320" fill="#A6E3A1" font-family="monospace" font-size="14">return {"status": "success", "ocr_text": text_data}</text>

      <text x="280" y="360" fill="#F38BA8" font-family="monospace" font-size="14">except</text>
      <text x="340" y="360" fill="#F9E2AF" font-family="monospace" font-size="14"> Exception as err:</text>
      <text x="310" y="390" fill="#F38BA8" font-family="monospace" font-size="14">logger.error(f"Error Code 500 in indexing: {err}")</text>

      <!-- Terminal Bottom Panel -->
      <rect x="220" y="550" width="1060" height="250" fill="#11111B"/>
      <rect x="220" y="550" width="1060" height="30" fill="#181825"/>
      <text x="235" y="570" fill="#A6ADC8" font-family="monospace" font-size="12">TERMINAL - bash</text>
      <text x="235" y="605" fill="#A6E3A1" font-family="monospace" font-size="13">user@macbook ~/ai-screenshot-finder % python3 async_handler.py</text>
      <text x="235" y="635" fill="#89B4FA" font-family="monospace" font-size="13">[INFO] Model loaded: ViT-B-32-laion2B-s34B-b79K in 0.42s</text>
      <text x="235" y="665" fill="#A6E3A1" font-family="monospace" font-size="13">[SUCCESS] Processed 1420 screenshots. Index ready on localhost:3000</text>
    </svg>`;
  } else if (type === 'receipt') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200" fill="none">
      <rect width="900" height="1200" fill="#E2E8F0"/>
      <!-- Receipt container -->
      <rect x="150" y="80" width="600" height="1040" fill="#FFFFFF" rx="8" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.1))"/>
      
      <text x="450" y="160" text-anchor="middle" fill="#0F172A" font-family="serif" font-size="28" font-weight="bold">BLUE BOTTLE COFFEE</text>
      <text x="450" y="195" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-size="14">315 Linden St, San Francisco, CA 94102</text>
      <text x="450" y="220" text-anchor="middle" fill="#64748B" font-family="sans-serif" font-size="14">Tel: (415) 252-7535 | Order #40812</text>
      <line x1="200" y1="250" x2="700" y2="250" stroke="#CBD5E1" stroke-dasharray="4 4" stroke-width="2"/>

      <text x="220" y="290" fill="#475569" font-family="sans-serif" font-size="14">Date: July 24, 2026 - 08:42 AM</text>
      <text x="220" y="315" fill="#475569" font-family="sans-serif" font-size="14">Server: Marcus | Station 2</text>

      <line x1="200" y1="340" x2="700" y2="340" stroke="#CBD5E1" stroke-width="2"/>
      
      <!-- Items -->
      <text x="220" y="380" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">1x Hayes Valley Espresso</text>
      <text x="650" y="380" text-anchor="end" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">$4.75</text>

      <text x="220" y="420" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">1x Cold Brew Oat Latte (Large)</text>
      <text x="650" y="420" text-anchor="end" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">$6.50</text>

      <text x="220" y="460" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">1x Almond Croissant</text>
      <text x="650" y="460" text-anchor="end" fill="#0F172A" font-family="sans-serif" font-size="16" font-weight="600">$5.25</text>

      <line x1="200" y1="500" x2="700" y2="500" stroke="#CBD5E1" stroke-dasharray="4 4" stroke-width="2"/>

      <text x="220" y="540" fill="#64748B" font-family="sans-serif" font-size="16">Subtotal</text>
      <text x="650" y="540" text-anchor="end" fill="#64748B" font-family="sans-serif" font-size="16">$16.50</text>

      <text x="220" y="575" fill="#64748B" font-family="sans-serif" font-size="16">Tax (8.625%)</text>
      <text x="650" y="575" text-anchor="end" fill="#64748B" font-family="sans-serif" font-size="16">$1.42</text>

      <text x="220" y="610" fill="#64748B" font-family="sans-serif" font-size="16">Tip (20%)</text>
      <text x="650" y="610" text-anchor="end" fill="#64748B" font-family="sans-serif" font-size="16">$3.30</text>

      <line x1="200" y1="640" x2="700" y2="640" stroke="#0F172A" stroke-width="2"/>

      <text x="220" y="685" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="bold">TOTAL</text>
      <text x="650" y="685" text-anchor="end" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="bold">$21.22</text>

      <text x="220" y="730" fill="#475569" font-family="sans-serif" font-size="14">Payment Method: Apple Pay (Visa **** 8821)</text>
      <text x="220" y="755" fill="#475569" font-family="sans-serif" font-size="14">Auth Code: 092182 | Status: APPROVED</text>

      <!-- Barcode mockup -->
      <rect x="250" y="810" width="400" height="70" fill="#0F172A"/>
      <text x="450" y="910" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="14">THANK YOU FOR VISITING US!</text>
    </svg>`;
  } else if (type === 'slack') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800" fill="none">
      <rect width="1280" height="800" fill="#1A1D21"/>
      <!-- Slack Left Bar -->
      <rect width="70" height="800" fill="#121519"/>
      <rect x="15" y="20" width="40" height="40" rx="10" fill="#E01E5A"/>
      
      <!-- Channels List -->
      <rect x="70" y="0" width="220" height="800" fill="#19171D"/>
      <text x="90" y="40" fill="#FFFFFF" font-family="sans-serif" font-size="18" font-weight="bold">Acme Corp</text>
      <text x="90" y="90" fill="#ABABAD" font-family="sans-serif" font-size="14"># general</text>
      <rect x="80" y="105" width="200" height="32" rx="6" fill="#1164A3"/>
      <text x="90" y="126" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold"># engineering-alerts</text>
      <text x="90" y="160" fill="#ABABAD" font-family="sans-serif" font-size="14"># design-system</text>
      <text x="90" y="195" fill="#ABABAD" font-family="sans-serif" font-size="14"># random</text>

      <!-- Main Message Area -->
      <rect x="290" y="0" width="990" height="60" fill="#1A1D21"/>
      <line x1="290" y1="60" x2="1280" y2="60" stroke="#2C2F36"/>
      <text x="320" y="38" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold"># engineering-alerts</text>

      <!-- Message 1 -->
      <circle cx="335" cy="110" r="20" fill="#2BAC76"/>
      <text x="330" y="116" fill="#FFF" font-family="sans-serif" font-size="14" font-weight="bold">S</text>
      <text x="370" y="105" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">Sarah Chen</text>
      <text x="460" y="105" fill="#ABABAD" font-family="sans-serif" font-size="12">10:14 AM</text>
      <text x="370" y="132" fill="#D1D2D3" font-family="sans-serif" font-size="14">Hey team! The production API is throwing a 500 internal server error on screenshot index lookup.</text>

      <!-- Message 2 Code attachment -->
      <circle cx="335" cy="210" r="20" fill="#E01E5A"/>
      <text x="330" y="216" fill="#FFF" font-family="sans-serif" font-size="14" font-weight="bold">D</text>
      <text x="370" y="205" fill="#FFFFFF" font-family="sans-serif" font-size="15" font-weight="bold">DevOps Bot</text>
      <text x="460" y="205" fill="#ABABAD" font-family="sans-serif" font-size="12">10:15 AM</text>

      <rect x="370" y="225" width="600" height="120" rx="8" fill="#222529" stroke="#E01E5A"/>
      <text x="390" y="255" fill="#E01E5A" font-family="monospace" font-size="13" font-weight="bold">CRITICAL ALERT: HTTP 500 Internal Server Error</text>
      <text x="390" y="285" fill="#D1D2D3" font-family="monospace" font-size="13">Traceback: OpenCLIP embedding dimension mismatch [512 != 768]</text>
      <text x="390" y="315" fill="#2BAC76" font-family="monospace" font-size="13">Suggested Fix: Re-index with ViT-B-32 model embeddings in Settings panel.</text>
    </svg>`;
  } else if (type === 'flight') {
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800" fill="none">
      <rect width="1280" height="800" fill="#0B192C"/>
      <!-- Header -->
      <rect width="1280" height="70" fill="#1E3E62"/>
      <text x="50" y="44" fill="#FFFFFF" font-family="sans-serif" font-size="22" font-weight="bold">DELTA AIRLINES - BOARDING PASS</text>
      
      <!-- Boarding Card -->
      <rect x="140" y="120" width="1000" height="520" rx="16" fill="#FFFFFF"/>
      <rect x="140" y="120" width="1000" height="100" rx="16" fill="#003366"/>
      <text x="180" y="180" fill="#FFFFFF" font-family="sans-serif" font-size="26" font-weight="bold">FLIGHT DL-1092</text>
      <text x="880" y="180" fill="#00D2FF" font-family="sans-serif" font-size="20" font-weight="bold">CONFIRMED</text>

      <text x="180" y="280" fill="#64748B" font-family="sans-serif" font-size="14">PASSENGER NAME</text>
      <text x="180" y="310" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="bold">ALEXANDER WONG</text>

      <text x="550" y="280" fill="#64748B" font-family="sans-serif" font-size="14">SEAT</text>
      <text x="550" y="310" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="bold">04A (FIRST CLASS)</text>

      <text x="850" y="280" fill="#64748B" font-family="sans-serif" font-size="14">GATE</text>
      <text x="850" y="310" fill="#0F172A" font-family="sans-serif" font-size="22" font-weight="bold">B22 (SFO T2)</text>

      <!-- Departure / Arrival -->
      <text x="180" y="390" fill="#003366" font-family="sans-serif" font-size="36" font-weight="bold">SFO</text>
      <text x="180" y="420" fill="#64748B" font-family="sans-serif" font-size="14">SAN FRANCISCO, CA</text>

      <text x="400" y="395" fill="#003366" font-family="sans-serif" font-size="28">✈ -------------------- ✈</text>

      <text x="850" y="390" fill="#003366" font-family="sans-serif" font-size="36" font-weight="bold">JFK</text>
      <text x="850" y="420" fill="#64748B" font-family="sans-serif" font-size="14">NEW YORK, NY</text>

      <line x1="180" y1="460" x2="1100" y2="460" stroke="#CBD5E1" stroke-width="2"/>

      <text x="180" y="510" fill="#475569" font-family="sans-serif" font-size="16">Date: August 12, 2026</text>
      <text x="550" y="510" fill="#475569" font-family="sans-serif" font-size="16">Boarding Time: 07:15 AM</text>
      <text x="850" y="510" fill="#475569" font-family="sans-serif" font-size="16">Ticket Ref: #DL-8821902</text>
    </svg>`;
  } else {
    // Figma design / dashboard mock
    svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="800" viewBox="0 0 1280 800" fill="none">
      <rect width="1280" height="800" fill="#2C2C2C"/>
      <rect width="1280" height="40" fill="#1E1E1E"/>
      <circle cx="20" cy="20" r="10" fill="#F24E1E"/>
      <text x="50" y="26" fill="#FFFFFF" font-family="sans-serif" font-size="14">AI Screenshot Search Dashboard UI - Figma</text>
      
      <!-- Canvas Canvas -->
      <rect x="200" y="100" width="880" height="600" fill="#0F172A" rx="12" stroke="#334155" stroke-width="2"/>
      <text x="240" y="150" fill="#38BDF8" font-family="sans-serif" font-size="24" font-weight="bold">AI Screenshot Finder Dashboard</text>
      <text x="240" y="180" fill="#94A3B8" font-family="sans-serif" font-size="14">Natural language OCR search using OpenCLIP ViT-B/32 neural embeddings</text>

      <rect x="240" y="220" width="800" height="50" rx="8" fill="#1E293B" stroke="#0EA5E9"/>
      <text x="270" y="252" fill="#94A3B8" font-family="sans-serif" font-size="14">🔍 Search receipts, code, error logs, flight tickets...</text>

      <rect x="240" y="300" width="240" height="160" rx="10" fill="#1E293B"/>
      <text x="260" y="340" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">OCR Text Engine</text>
      <text x="260" y="370" fill="#38BDF8" font-family="sans-serif" font-size="28" font-weight="bold">184.3k</text>
      <text x="260" y="400" fill="#64748B" font-family="sans-serif" font-size="12">Words Extracted</text>

      <rect x="520" y="300" width="240" height="160" rx="10" fill="#1E293B"/>
      <text x="540" y="340" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">OpenCLIP Model</text>
      <text x="540" y="370" fill="#4ADE80" font-family="sans-serif" font-size="28" font-weight="bold">ViT-B/32</text>
      <text x="540" y="400" fill="#64748B" font-family="sans-serif" font-size="12">512-dim Vector Embeddings</text>

      <rect x="800" y="300" width="240" height="160" rx="10" fill="#1E293B"/>
      <text x="820" y="340" fill="#F8FAFC" font-family="sans-serif" font-size="16" font-weight="bold">Watchdog Monitor</text>
      <text x="820" y="370" fill="#FACC15" font-family="sans-serif" font-size="28" font-weight="bold">Active</text>
      <text x="820" y="400" fill="#64748B" font-family="sans-serif" font-size="12">Listening ~/Pictures/Screenshots</text>
    </svg>`;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

export const INITIAL_SCREENSHOTS: Screenshot[] = [
  {
    id: 'shot-1',
    filename: '2026-07-24_code_python_async.png',
    filePath: '~/Pictures/Screenshots/2026-07-24_code_python_async.png',
    imageUrl: createMockUiSvg('code'),
    appSource: 'VS Code',
    category: 'Code',
    createdAt: '2026-07-24T14:32:00Z',
    dimensions: { width: 1280, height: 800 },
    fileSizeMB: 1.82,
    ocrText: `server/api/async_handler.py - VS Code
EXPLORER
src/ async_handler.py openclip_indexer.py ocr_processor.py
import asyncio, open_clip, torch, pytesseract
async def process_screenshot_embeddings(image_path: str):
    """Extracts OpenCLIP embeddings and OCR text concurrently"""
    try:
        image = Image.open(image_path)
        text_data = pytesseract.image_to_string(image)
        # OpenCLIP ViT-B/32 text similarity vector encoding
        model, _, preprocess = open_clip.create_model_and_transforms('ViT-B-32')
        return {"status": "success", "ocr_text": text_data}
    except Exception as err:
        logger.error(f"Error Code 500 in indexing: {err}")
TERMINAL - bash
user@macbook ~/ai-screenshot-finder % python3 async_handler.py
[INFO] Model loaded: ViT-B-32-laion2B-s34B-b79K in 0.42s
[SUCCESS] Processed 1420 screenshots. Index ready on localhost:3000`,
    ocrBlocks: [
      { id: 'b1', text: 'server/api/async_handler.py - VS Code', bbox: { x: 45, y: 1.5, width: 35, height: 3 }, confidence: 0.98 },
      { id: 'b2', text: 'import asyncio, open_clip, torch, pytesseract', bbox: { x: 19.5, y: 8, width: 35, height: 3 }, confidence: 0.97 },
      { id: 'b3', text: 'async def process_screenshot_embeddings(image_path: str):', bbox: { x: 19.5, y: 12, width: 45, height: 3 }, confidence: 0.99 },
      { id: 'b4', text: '# OpenCLIP ViT-B/32 text similarity vector encoding', bbox: { x: 24, y: 31, width: 42, height: 3 }, confidence: 0.96 },
      { id: 'b5', text: 'logger.error(f"Error Code 500 in indexing: {err}")', bbox: { x: 24, y: 47, width: 38, height: 3 }, confidence: 0.99 },
      { id: 'b6', text: '[SUCCESS] Processed 1420 screenshots. Index ready on localhost:3000', bbox: { x: 18.5, y: 82, width: 55, height: 3 }, confidence: 0.98 }
    ],
    tags: ['python', 'openclip', 'ocr', 'error 500', 'async', 'vs code'],
    isFavorite: true,
  },
  {
    id: 'shot-2',
    filename: '2026-07-24_blue_bottle_coffee_receipt.png',
    filePath: '~/Pictures/Screenshots/2026-07-24_blue_bottle_coffee_receipt.png',
    imageUrl: createMockUiSvg('receipt'),
    appSource: 'Receipt',
    category: 'Receipts & Invoices',
    createdAt: '2026-07-24T08:42:00Z',
    dimensions: { width: 900, height: 1200 },
    fileSizeMB: 2.15,
    ocrText: `BLUE BOTTLE COFFEE
315 Linden St, San Francisco, CA 94102
Tel: (415) 252-7535 | Order #40812
Date: July 24, 2026 - 08:42 AM
Server: Marcus | Station 2
1x Hayes Valley Espresso $4.75
1x Cold Brew Oat Latte (Large) $6.50
1x Almond Croissant $5.25
Subtotal $16.50
Tax (8.625%) $1.42
Tip (20%) $3.30
TOTAL $21.22
Payment Method: Apple Pay (Visa **** 8821)
Auth Code: 092182 | Status: APPROVED
THANK YOU FOR VISITING US!`,
    ocrBlocks: [
      { id: 'r1', text: 'BLUE BOTTLE COFFEE', bbox: { x: 25, y: 12, width: 50, height: 4 }, confidence: 0.99 },
      { id: 'r2', text: 'Order #40812 Date: July 24, 2026 - 08:42 AM', bbox: { x: 24, y: 17, width: 52, height: 3 }, confidence: 0.98 },
      { id: 'r3', text: '1x Cold Brew Oat Latte (Large) $6.50', bbox: { x: 24, y: 34, width: 52, height: 3 }, confidence: 0.99 },
      { id: 'r4', text: '1x Almond Croissant $5.25', bbox: { x: 24, y: 37, width: 52, height: 3 }, confidence: 0.97 },
      { id: 'r5', text: 'TOTAL $21.22', bbox: { x: 24, y: 55, width: 52, height: 5 }, confidence: 0.99 },
      { id: 'r6', text: 'Payment Method: Apple Pay (Visa **** 8821)', bbox: { x: 24, y: 60, width: 52, height: 3 }, confidence: 0.96 }
    ],
    tags: ['coffee', 'blue bottle', 'receipt', 'espresso', 'san francisco', 'apple pay', 'expenses'],
    isFavorite: true,
  },
  {
    id: 'shot-3',
    filename: '2026-07-23_slack_error_500_discussion.png',
    filePath: '~/Pictures/Screenshots/2026-07-23_slack_error_500_discussion.png',
    imageUrl: createMockUiSvg('slack'),
    appSource: 'Slack',
    category: 'Chat',
    createdAt: '2026-07-23T10:15:00Z',
    dimensions: { width: 1280, height: 800 },
    fileSizeMB: 1.45,
    ocrText: `Acme Corp # general # engineering-alerts # design-system # random
# engineering-alerts
Sarah Chen 10:14 AM
Hey team! The production API is throwing a 500 internal server error on screenshot index lookup.
DevOps Bot 10:15 AM
CRITICAL ALERT: HTTP 500 Internal Server Error
Traceback: OpenCLIP embedding dimension mismatch [512 != 768]
Suggested Fix: Re-index with ViT-B-32 model embeddings in Settings panel.`,
    ocrBlocks: [
      { id: 's1', text: '# engineering-alerts', bbox: { x: 25, y: 4.5, width: 25, height: 3.5 }, confidence: 0.99 },
      { id: 's2', text: 'Hey team! The production API is throwing a 500 internal server error', bbox: { x: 29, y: 15, width: 55, height: 3 }, confidence: 0.98 },
      { id: 's3', text: 'CRITICAL ALERT: HTTP 500 Internal Server Error', bbox: { x: 30, y: 31, width: 45, height: 3.5 }, confidence: 0.99 },
      { id: 's4', text: 'OpenCLIP embedding dimension mismatch [512 != 768]', bbox: { x: 30, y: 35, width: 45, height: 3 }, confidence: 0.97 }
    ],
    tags: ['slack', 'sarah chen', 'error 500', 'openclip', 'chat', 'devops'],
    isFavorite: false,
  },
  {
    id: 'shot-4',
    filename: '2026-07-20_delta_flight_boarding_pass_sfo_jfk.png',
    filePath: '~/Pictures/Screenshots/2026-07-20_delta_flight_boarding_pass_sfo_jfk.png',
    imageUrl: createMockUiSvg('flight'),
    appSource: 'Safari',
    category: 'Documents',
    createdAt: '2026-07-20T18:05:00Z',
    dimensions: { width: 1280, height: 800 },
    fileSizeMB: 1.95,
    ocrText: `DELTA AIRLINES - BOARDING PASS
FLIGHT DL-1092 CONFIRMED
PASSENGER NAME: ALEXANDER WONG
SEAT: 04A (FIRST CLASS)
GATE: B22 (SFO T2)
SFO SAN FRANCISCO, CA -> JFK NEW YORK, NY
Date: August 12, 2026
Boarding Time: 07:15 AM
Ticket Ref: #DL-8821902`,
    ocrBlocks: [
      { id: 'f1', text: 'DELTA AIRLINES - BOARDING PASS', bbox: { x: 12, y: 18, width: 40, height: 4 }, confidence: 0.99 },
      { id: 'f2', text: 'FLIGHT DL-1092 CONFIRMED', bbox: { x: 14, y: 22, width: 35, height: 3.5 }, confidence: 0.99 },
      { id: 'f3', text: 'PASSENGER NAME: ALEXANDER WONG', bbox: { x: 14, y: 35, width: 35, height: 3.5 }, confidence: 0.98 },
      { id: 'f4', text: 'SFO SAN FRANCISCO -> JFK NEW YORK', bbox: { x: 14, y: 48, width: 65, height: 5 }, confidence: 0.99 }
    ],
    tags: ['flight', 'delta', 'boarding pass', 'sfo', 'jfk', 'airline ticket', 'travel'],
    isFavorite: true,
  },
  {
    id: 'shot-5',
    filename: '2026-07-18_figma_ai_screenshot_dashboard_wireframe.png',
    filePath: '~/Pictures/Screenshots/2026-07-18_figma_ai_screenshot_dashboard_wireframe.png',
    imageUrl: createMockUiSvg('figma'),
    appSource: 'Figma',
    category: 'Web & Design',
    createdAt: '2026-07-18T11:20:00Z',
    dimensions: { width: 1280, height: 800 },
    fileSizeMB: 2.40,
    ocrText: `AI Screenshot Search Dashboard UI - Figma
AI Screenshot Finder Dashboard
Natural language OCR search using OpenCLIP ViT-B/32 neural embeddings
Search receipts, code, error logs, flight tickets...
OCR Text Engine 184.3k Words Extracted
OpenCLIP Model ViT-B/32 512-dim Vector Embeddings
Watchdog Monitor Active Listening ~/Pictures/Screenshots`,
    ocrBlocks: [
      { id: 'g1', text: 'AI Screenshot Search Dashboard UI - Figma', bbox: { x: 4, y: 2, width: 40, height: 3 }, confidence: 0.99 },
      { id: 'g2', text: 'AI Screenshot Finder Dashboard', bbox: { x: 18, y: 18, width: 45, height: 4 }, confidence: 0.99 },
      { id: 'g3', text: 'Natural language OCR search using OpenCLIP ViT-B/32 neural embeddings', bbox: { x: 18, y: 22, width: 55, height: 3 }, confidence: 0.97 },
      { id: 'g4', text: 'Watchdog Monitor Active Listening ~/Pictures/Screenshots', bbox: { x: 62, y: 37, width: 22, height: 12 }, confidence: 0.96 }
    ],
    tags: ['figma', 'ui design', 'wireframe', 'dashboard', 'openclip', 'ocr'],
    isFavorite: false,
  },
];

export const DEFAULT_SETTINGS = {
  theme: 'dark' as const,
  folderPath: '~/Pictures/Screenshots',
  recursiveScan: true,
  allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
  watchdogEnabled: true,
  watchdogIntervalSeconds: 5,
  autoOCR: true,
  clipModel: 'ViT-B-32 (laion2B-s34B-b79K)',
  ocrEngine: 'Tesseract 5.3.0 + PaddleOCR Engine',
  hardwareAccel: 'Apple Metal / GPU Accelerated',
  maxMemoryMB: 2048,
};
