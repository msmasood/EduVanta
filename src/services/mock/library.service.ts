import type { PaginatedResponse, ApiResponse, QueryParams } from "@/types/common";
import type { Book, LibraryMember, BookIssue } from "@/types/library";
import { books, libraryMembers, bookIssues } from "@/data/mock/library";
import { withMockDelay } from "./delay";
import { createMockResponse, createPaginatedResponse, getById, createErrorResponse, applyQueryParams } from "./helpers";

export async function getBooks(params?: QueryParams, ms = 250): Promise<PaginatedResponse<Book>> {
  const filtered = applyQueryParams(books, params, ["title", "author", "isbn", "subject"] as (keyof Book)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getBookById(id: string, ms = 250): Promise<ApiResponse<Book>> {
  const book = getById(books, id);
  if (!book) return withMockDelay(createErrorResponse<Book>(`Book '${id}' not found`), ms);
  return withMockDelay(createMockResponse(book), ms);
}

export async function getLibraryMembers(ms = 250): Promise<ApiResponse<LibraryMember[]>> {
  return withMockDelay(createMockResponse(libraryMembers), ms);
}

export async function getLibraryMemberById(id: string, ms = 250): Promise<ApiResponse<LibraryMember>> {
  const member = getById(libraryMembers, id);
  if (!member) return withMockDelay(createErrorResponse<LibraryMember>(`Library member '${id}' not found`), ms);
  return withMockDelay(createMockResponse(member), ms);
}

export async function getBookIssues(params?: QueryParams, ms = 250): Promise<PaginatedResponse<BookIssue>> {
  const filtered = applyQueryParams(bookIssues, params, [] as (keyof BookIssue)[]);
  return withMockDelay(createPaginatedResponse(filtered, params), ms);
}

export async function getMemberIssues(memberId: string, ms = 250): Promise<ApiResponse<BookIssue[]>> {
  const issues = bookIssues.filter((i) => i.memberId === memberId);
  return withMockDelay(createMockResponse(issues), ms);
}

export async function getOverdueIssues(ms = 250): Promise<ApiResponse<BookIssue[]>> {
  const overdue = bookIssues.filter((i) => i.status === "overdue");
  return withMockDelay(createMockResponse(overdue), ms);
}
