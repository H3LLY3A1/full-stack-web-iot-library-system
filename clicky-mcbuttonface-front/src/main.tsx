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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/add-form" element={<AddBookFormPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/clients/add-form" element={<AddClientFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
