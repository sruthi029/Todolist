"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addTodo,
  deleteTodo,
  fetchTodos,
  Todo,
  updateTodo,
} from "../action/addform";
import { error } from "console";

export default function Home() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isUpdateMode, setUpdateMode] = useState(false);
  const [pending, setpending] = useState(false);

  useEffect(() => {
    fetchTodos().then(setTodos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setpending(true);
    if (isUpdateMode && selectedTodo) {
      const result = await updateTodo(selectedTodo.id, title, details, dueDate);
      toast.promise(
        new Promise((resolve, reject) => {
          if (result.success) {
            resolve("Todo updated successfully!");
            setUpdateMode(false);
            setSelectedTodo(null);
          } else {
            reject(result.error || "Failed to update todo");
          }
        }),
        {
          loading: "Updating List ...",
          success: (message) => `${message}`,
          error: (error) => error,
        }
      );
      setpending(false);
    } else {
      const result = await addTodo(title, details, dueDate);
      setpending(true);
      toast.promise(
        new Promise((resolve, reject) => {
          if (result.success) {
            resolve("Todo added successfully!");
          } else {
            reject(result.error || "Failed to add todo");
          }
        }),
        {
          loading: "Adding List...",
          success: (message) => `${message}`,
          error: (error) => error,
        }
      );
      setpending(false);
    }
    setTitle("");
    setDetails("");
    setDueDate("");
    setpending(false);
    const updatedTodos = await fetchTodos();
    setTodos(updatedTodos);
  };

  const handleUpdateClick = (todo: Todo) => {
    setTitle(todo.title || "");
    setDetails(todo.details || "");
    setDueDate(todo.dueDate || "");
    setSelectedTodo(todo);
    setUpdateMode(true);
  };

  const handleDeleteClick = async (id: string) => {
    const result = await deleteTodo(id);

    if (result.success) {
      toast.success("Todo deleted successfully!");
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      setTodos(updatedTodos);
    } else {
      toast.error(result.error || "Failed to delete todo");
    }
  };
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center md:flex-row ">
        <section className="flex-1 flex md:flex-col items-center md:justify-start mx-auto">
          <div className="absolute top-4 left-4">
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
          <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-slate-600">
            <h1 className="text-center text-2xl font-bold leading-9 text-gray-900">
              {isUpdateMode ? "Update Your Todo" : "Create a Todo"}
            </h1>
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Title
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    autoComplete="off"
                    required
                    value={title}
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded border py-2 pl-2 text-white shadow ring bg-black "
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="details"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Details
                </label>
                <div className="mt-2">
                  <textarea
                    id="details"
                    name="details"
                    rows={4}
                    autoComplete="off"
                    spellCheck
                    placeholder="Details"
                    required
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full rounded border py-2 pl-2 text-white shadow ring bg-black resize-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  DueDate
                </label>
                <div className="mt-2">
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    autoComplete="off"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded border py-2 pl-2 text-white shadow ring bg-black resize-none"
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={pending}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700"
                >
                  {isUpdateMode ? "Upadte Todo" : "Create Todo"}
                </button>
              </div>
            </form>
          </div>
        </section>
        <section className="md:w-1/2 md:max-h-screen overflow-y-auto md:ml-10 mt-20 mx-auto">
          <div className="p-6 md:p-12 mt-10 rounded-lg shadow-xl w-full max-w-lg bg-gray-700">
            <h1 className="text-center text-2xl font-bold leading-9 text-gray-900">
              Todo List
            </h1>
            <div className="mt-6 spcae-y-6">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="border p-4 rounded-md shadow-md mt-2"
                >
                  <h3 className="text-lg font-semibold text-gray-900 break-words">
                    Title:{todo.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Due Date:{todo.dueDate}
                  </p>
                  <p className="text-gray-900 multline break-words">
                    Details:{todo.details}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(todo.createdAt).toLocaleString()}
                  </p>
                  <div className="mt-4 space-x-6">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-md"
                      onClick={() => handleUpdateClick(todo)}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md"
                      onClick={() => handleDeleteClick(todo.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
