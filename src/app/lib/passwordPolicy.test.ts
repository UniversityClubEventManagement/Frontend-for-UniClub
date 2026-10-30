import { describe, it, expect } from "vitest";
import { isPasswordValid } from "./passwordPolicy";

describe("Password Validation Unit Tests", () => {

  it("TC01 - Accepts a valid password", () => {
    expect(isPasswordValid("Student@123")).toBe(true);
  });

  it("TC02 - Rejects passwords shorter than 8 characters", () => {
    expect(isPasswordValid("Ab@123")).toBe(false);
  });

  it("TC03 - Rejects passwords without numbers", () => {
    expect(isPasswordValid("Student@abc")).toBe(false);
  });

  it("TC04 - Rejects passwords without special characters", () => {
    expect(isPasswordValid("Student123")).toBe(false);
  });

  it("TC05 - Rejects passwords containing spaces", () => {
    expect(isPasswordValid("Student @123")).toBe(false);
  });

  it("TC06 - Rejects empty passwords", () => {
    expect(isPasswordValid("")).toBe(false);
  });

  it("TC07 - Accepts exactly 8 characters", () => {
    expect(isPasswordValid("Stud@123")).toBe(true);
  });

  it("TC08 - Accepts a long valid password", () => {
    expect(isPasswordValid("University@2026")).toBe(true);
  });

});