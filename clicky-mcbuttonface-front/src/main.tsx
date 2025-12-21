import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/home-page";
import RootLayout from "./layouts/root-layout";
import ClientsPage from "./pages/clients/clients-page";
import AddClientFormPage from "./pages/clients/add-client-form-page";
import BooksPage from "./pages/books/books-page";
import AddBookFormPage from "./pages/books/add-book-form-page";
import ClientPage from "./pages/clients/client-page";
import BookPage from "./pages/books/book-page";
import EditBookPage from "./pages/books/edit-book-page";
import EditClientPage from "./pages/clients/edit-client-page";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/books/:cardUid/edit" element={<EditBookPage />} />
          <Route path="/books/add-form" element={<AddBookFormPage />} />
          <Route path="/clients/:id" element={<ClientPage />} />
          <Route path="/clients/:cardUid/edit" element={<EditClientPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/add-form" element={<AddClientFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
