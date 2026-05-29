import { NextRequest, NextResponse } from 'next/server';
import { getTelemetry, setTelemetry } from '@/lib/telemetryStore';

export async function GET() {
  try {
    const telemetry = getTelemetry();
    return NextResponse.json({ success: true, data: telemetry }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch telemetry' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const updated = setTelemetry({
      acceleration: body.acceleration,
      rollAngle: body.rollAngle ?? body.roll_angle,
      speed: body.speed,
      strainValue: body.strainValue ?? body.strain_value,
      crashProbability: body.crashProbability ?? body.crash_probability,
      severity: body.severity,
      emergencyActive: body.emergencyActive ?? body.emergency_active ?? false,
      bleStatus: body.bleStatus ?? body.ble_status ?? 'idle',
      location: body.location,
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid telemetry payload' }, { status: 400 });
  }
}
