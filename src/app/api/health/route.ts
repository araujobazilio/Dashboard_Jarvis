import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'health.json');

const defaultHealthData = {
  profile: { name: "Rafael Bazilio", age: 40, weight: 67, height: 173, imc: 22.4 },
  conditions: ["HAS (Non-Dipper)", "Dislipidemia", "Hipogonadismo", "Poliglobulia", "Onicomicose"],
  medications: [
    { name: "Telmisartana", dosage: "80mg", frequency: "1x/dia", time: "manha" },
    { name: "Levolandipino", dosage: "5mg", frequency: "1x/dia", time: "manha" },
    { name: "Rosuvastatina", dosage: "10mg", frequency: "3x/semana" },
    { name: "Ezetimiba", dosage: "10mg", frequency: "1x/dia" },
    { name: "Durateston", dosage: "125mg", frequency: "2x/semana", time: "subcutanea" },
    { name: "Isotretinoina", dosage: "10-20mg", frequency: "1-2x/semana" }
  ],
  lastExams: [
    { id: "e1", name: "Vitamina B12", value: 1150, unit: "pg/mL", date: "2025-12-15", referenceMin: 200, referenceMax: 900, status: "high" },
    { id: "e2", name: "Homocisteina", value: 12, unit: "umol/L", date: "2025-12-15", referenceMin: 5, referenceMax: 15, status: "normal" },
    { id: "e3", name: "LDL", value: 187, unit: "mg/dL", date: "2025-12-10", referenceMin: 0, referenceMax: 100, status: "high" },
    { id: "e4", name: "Hemoglobina", value: 17.5, unit: "g/dL", date: "2025-12-10", referenceMin: 13.5, referenceMax: 17.5, status: "normal" },
    { id: "e5", name: "Testosterona", value: 650, unit: "ng/dL", date: "2025-12-01", referenceMin: 300, referenceMax: 1000, status: "normal" }
  ],
  alerts: [
    "B12 > 1000 pg/mL normaliza Homocisteina",
    "LDL ainda elevado - considerar ajuste",
    "Proxima sangria: verificar com hematologista"
  ]
};

async function getHealthData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(defaultHealthData, null, 2));
    return defaultHealthData;
  }
}

export async function GET() {
  const data = await getHealthData();
  return NextResponse.json({ status: 'ok', data });
}

export async function POST(request: Request) {
  const body = await request.json();
  const healthData = await getHealthData();
  const { name, value, unit, date, referenceMin, referenceMax } = body;
  
  let status = 'normal';
  if (referenceMax && value > referenceMax) status = 'high';
  else if (referenceMin && value < referenceMin) status = 'low';
  
  const newExam = {
    id: 'exam-' + Date.now(),
    name, value, unit,
    date: date || new Date().toISOString().split('T')[0],
    referenceMin, referenceMax, status
  };
  
  const existingIndex = healthData.lastExams.findIndex(e => e.name === name);
  if (existingIndex >= 0) healthData.lastExams[existingIndex] = newExam;
  else healthData.lastExams.unshift(newExam);
  
  await fs.writeFile(DATA_FILE, JSON.stringify(healthData, null, 2));
  return NextResponse.json({ status: 'ok', exam: newExam });
}
