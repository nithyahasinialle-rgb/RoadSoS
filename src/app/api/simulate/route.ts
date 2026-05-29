import { NextRequest, NextResponse } from 'next/server';
import { setTelemetry } from '@/lib/telemetryStore';
import { generateSimulatedTelemetry } from '@/lib/simulationEngine';
import type { SimulationMode } from '@/lib/telemetryStore';

const VALID_MODES: SimulationMode[] = ['normal', 'minor', 'severe', 'sos'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const mode = body.mode as SimulationMode;

    if (!VALID_MODES.includes(mode)) {
      return NextResponse.json(
        { success: false, error: `Invalid mode. Must be one of: ${VALID_MODES.join(', ')}` },
        { status: 400 }
      );
    }

    const simData = generateSimulatedTelemetry(mode);
    const updated = setTelemetry(simData);

    return NextResponse.json({ success: true, mode, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to set simulation mode' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      modes: VALID_MODES,
      description: 'POST with { "mode": "normal|minor|severe|sos" } to set simulation state',
    },
    { status: 200 }
  );
}
