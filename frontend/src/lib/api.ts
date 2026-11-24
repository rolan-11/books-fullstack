const API_BASE = import.meta.env.VITE_API_URL || "";

export interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  publishedDate: string;
  available: boolean;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookInput {
  title: string;
  author: string;
  price: number;
  publishedDate: string;
  available: boolean;
  description: string;
}

export interface BooksQueryParams {
  search?: string;
  available?: "" | "true" | "false";
  sort?: "newest" | "price_asc" | "price_desc" | "title_asc";
  page?: number;
  limit?: number;
}

export interface PaginatedBooksResponse {
  data: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Ocurrió un error en la petición");
  }
  return data as T;
}

export const getBooks = async (
  params: BooksQueryParams = {}
): Promise<PaginatedBooksResponse> => {
  const searchParams = new URLSearchParams();

  if (params.search && params.search.trim()) {
    searchParams.set("search", params.search.trim());
  }
  if (params.available === "true" || params.available === "false") {
    searchParams.set("available", params.available);
  }
  if (params.sort) {
    searchParams.set("sort", params.sort);
  }
  if (params.page) {
    searchParams.set("page", String(params.page));
  }
  if (params.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();
  const url = `${API_BASE}/api/books${query ? `?${query}` : ""}`;

  const res = await fetch(url, {
    credentials: "include",
  });
  return handleResponse<PaginatedBooksResponse>(res);
};

export const getBookById = async (id: string): Promise<Book> => {
  const res = await fetch(`${API_BASE}/api/books/${id}`, {
    credentials: "include",
  });
  return handleResponse<Book>(res);
};

export const createBook = async (book: BookInput): Promise<Book> => {
  const res = await fetch(`${API_BASE}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(book),
  });
  return handleResponse<Book>(res);
};

export const updateBook = async (
  id: string,
  book: Partial<BookInput>
): Promise<Book> => {
  const res = await fetch(`${API_BASE}/api/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(book),
  });
  return handleResponse<Book>(res);
};

export const deleteBook = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/api/books/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  await handleResponse(res);
};