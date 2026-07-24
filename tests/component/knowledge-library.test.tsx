import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KnowledgeLibrary } from "@/features/knowledge/knowledge-library";

const articles=[
  {slug:"strength-basics",title:"Strength basics",excerpt:"A practical introduction to repeatable strength training.",category:"Training",readingTime:6,updatedAt:"2026-07-01"},
  {slug:"protein-basics",title:"Protein basics",excerpt:"A calm guide to protein and everyday meals.",category:"Nutrition",readingTime:5,updatedAt:"2026-07-02"}
];

describe("KnowledgeLibrary",()=>{
  it("searches, filters categories, clears, and shows an empty result",()=>{
    render(<KnowledgeLibrary locale="en" articles={articles}/>);
    fireEvent.change(screen.getByRole("searchbox"),{target:{value:"protein"}});
    expect(screen.getByText("Protein basics")).toBeInTheDocument();
    expect(screen.queryByText("Strength basics")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Training"}));
    expect(screen.getByText("No guides match those filters.")).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button",{name:"Clear filters"})[0]);
    expect(screen.getByText("Strength basics")).toBeInTheDocument();
  });
});
