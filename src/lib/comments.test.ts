import { describe, it, expect } from "vitest";
import { classifyBody, isHoneypotTripped, hashIp, newCommentMessage } from "./comments";

describe("classifyBody", () => {
  it("accepts a clean comment", () => {
    expect(classifyBody("Спасибо, очень полезная статья про грунт!").ok).toBe(true);
  });
  it("rejects comments containing links", () => {
    expect(classifyBody("Загляните на http://spam.ru дешево").ok).toBe(false);
    expect(classifyBody("пишите на www.casino.com").ok).toBe(false);
  });
  it("rejects banned words", () => {
    expect(classifyBody("Лучшее казино и ставки тут").ok).toBe(false);
  });
  it("rejects all-caps shouting", () => {
    expect(classifyBody("КУПИТЕ СРОЧНО ВЫГОДНО ЖМИ СЮДА ПРЯМ СЕЙЧАС").ok).toBe(false);
  });
  it("rejects mostly-latin spam for RU audience", () => {
    expect(classifyBody("Buy cheap pills online best price now click").ok).toBe(false);
  });
  it("rejects too-short bodies", () => {
    expect(classifyBody("ок").ok).toBe(false);
  });
});

describe("isHoneypotTripped", () => {
  it("trips when the hidden field is filled", () => {
    expect(isHoneypotTripped("http://bot.com")).toBe(true);
  });
  it("passes when empty", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });
});

describe("hashIp", () => {
  it("is deterministic and not the raw ip", () => {
    const h = hashIp("1.2.3.4");
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(h).toBe(hashIp("1.2.3.4"));
    expect(h).not.toContain("1.2.3.4");
  });
});

describe("newCommentMessage", () => {
  it("includes article title, author and both action links", () => {
    const msg = newCommentMessage({
      articleTitle: "Монстера: уход",
      slug: "monstera-uhod-vidy",
      authorName: "Аня",
      body: "Класс!",
      commentId: "c1",
      token: "tok123",
    });
    expect(msg).toContain("Монстера: уход");
    expect(msg).toContain("Аня");
    expect(msg).toContain("action=approve");
    expect(msg).toContain("action=reject");
    expect(msg).toContain("tok123");
  });
});
