import { describe, expect, it } from "bun:test";
import { parseFrontmatter, serializeFrontmatter } from "../frontmatter.js";

describe("frontmatter", () => {
  it("round-trips frontmatter and body", () => {
    const original = serializeFrontmatter(
      {
        id: "record-1",
        title: "Record One",
        status: "active",
        tags: ["workflow", undefined, "planning"],
      },
      "# Record One\n\nBody text.",
    );

    const parsed = parseFrontmatter(original);

    expect(parsed.frontmatter).toMatchObject({
      id: "record-1",
      title: "Record One",
      status: "active",
      tags: ["workflow", "planning"],
    });
    expect(parsed.body).toBe("# Record One\n\nBody text.\n");
  });

  it("omits the frontmatter block when metadata is empty", () => {
    expect(serializeFrontmatter({}, "# Body")).toBe("# Body\n");
  });
});
