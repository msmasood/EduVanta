"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import {
  getBooks,
  getBookById,
  getLibraryMembers,
  getLibraryMemberById,
  getBookIssues,
  getMemberIssues,
  getOverdueIssues,
} from "@/services/mock/library.service";
import type { QueryParams } from "@/types/common";

export function useBooks(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.library.books(params),
    queryFn: () => getBooks(params),
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: queryKeys.library.book(id),
    queryFn: () => getBookById(id),
    enabled: !!id,
  });
}

export function useLibraryMembers() {
  return useQuery({ queryKey: queryKeys.library.members(), queryFn: () => getLibraryMembers() });
}

export function useLibraryMember(id: string) {
  return useQuery({
    queryKey: queryKeys.library.member(id),
    queryFn: () => getLibraryMemberById(id),
    enabled: !!id,
  });
}

export function useBookIssues(params?: QueryParams) {
  return useQuery({
    queryKey: queryKeys.library.issues(params),
    queryFn: () => getBookIssues(params),
  });
}

export function useMemberIssues(memberId: string) {
  return useQuery({
    queryKey: queryKeys.library.memberIssues(memberId),
    queryFn: () => getMemberIssues(memberId),
    enabled: !!memberId,
  });
}

export function useOverdueIssues() {
  return useQuery({ queryKey: queryKeys.library.overdue(), queryFn: () => getOverdueIssues() });
}
