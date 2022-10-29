import { describe, expect, afterAll, it } from "vitest";
import { promises as fs } from "fs";
import { app, server } from "./utils/server";
import request from "supertest";
import { video1Path, video2Path } from "./sampleData";

describe("media streamer", function() {
  afterAll(() => {
    server.close();
  });

  it("400 on invalid query", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(400);
    expect(response.text).toBe("{\"error\":\"Request must be sent with a valid 'filePath' as a query\"}");
  });

  it("404 when file not found", async () => {
    const response = await request(app).get("/?filePath=1.Beach.mp4");
    expect(response.status).toBe(404);
    expect(response.text).toBe("{\"error\":\"File not found\"}");
  });

  it("406 on unsupported media format", async () => {
    const response = await request(app).get(`/?filePath=${video2Path}`);
    expect(response.status).toBe(406);
    expect(response.text).toBe("{\"error\":\"Unsupported media format\"}");
  });

  it("206, streams video(w/ range)", async () => {
    const { size: videoSize } = await fs.stat(video1Path);
    const start = 100;
    const end = videoSize - 1;
    const response = await request(app).get(`/?filePath=${video1Path}`).set("Range", `bytes=${start}-${end}`);
    expect(response.status).toBe(206);
    expect(response.headers["content-type"]).toBe("video/mp4");
    expect(response.headers["content-length"]).toBe(String(videoSize - start));
    expect(response.headers["content-range"]).toBe(`bytes ${start}-${end}/${videoSize}`);
  });

  it("200, streams video(w/o range)", async () => {
    const { size: videoSize } = await fs.stat(video1Path);
    const response = await request(app).get(`/?filePath=${video1Path}`);
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("video/mp4");
    expect(response.headers["content-range"]).toBe(undefined);
    expect(response.headers["content-length"]).toBe(String(videoSize));
  });
});
