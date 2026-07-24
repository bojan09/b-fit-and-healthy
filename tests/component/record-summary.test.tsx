import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecordSummary } from "@/features/fitness/record-summary";
describe("RecordSummary", () => { it("renders empty and genuine record values", () => { const { rerender } = render(<RecordSummary records={[]} units="metric" />); expect(screen.getByText(/complete a workout/i)).toBeInTheDocument(); rerender(<RecordSummary units="metric" records={[{exerciseId:"x",exerciseName:"Squat",heaviestLoadKg:80,maxReps:8,bestSetVolumeKg:480,bestSessionVolumeKg:880,achievedAt:"2026-07-21"}]} />); for (const value of ["80 kg","8 reps","480 kg","880 kg"]) expect(screen.getByText(value)).toBeInTheDocument(); }); });
