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

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Ocurrió un error en la petición");
  }
  return data as T;
}

export const getBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE}/api/books`, {
    credentials: "include",
  });
  return handleResponse<Book[]>(res);
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