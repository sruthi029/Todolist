// app/actions.ts
'use server'

import { db } from "@/firebase/clientApp";
import { addDoc, collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

export type Todo = {
  id: string;
  title: string;
  details: string;
  dueDate: string;
  createdAt: any;
};

export async function addTodo(title: string, details: string, dueDate: string) {
  try {
    const createdAt = Timestamp.fromDate(new Date());
    const docRef = await addDoc(collection(db, "todos"), {
      title,
      details,
      dueDate,
      createdAt,
    });
    return { success: true, id: docRef.id,createdAt: createdAt.toMillis() };
  } catch (error) {
    console.error("Error adding todo:", error);
    return { success: false, error: "Failed to add todo" };
  }
}
export async function updateTodo(id: string, title: string, details: string, dueDate: string) {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, { title, details, dueDate });
      return { success: true };
    } catch (error) {
      console.error("Error updating todo:", error);
      return { success: false, error: "Failed to update todo" };
    }
  }
  
  export async function deleteTodo(id: string) {
    try {
      await deleteDoc(doc(db, "todos", id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting todo:", error);
      return { success: false, error: "Failed to delete todo" };
    }
  }

  export async function fetchTodos(): Promise<Todo[]> {
    try {
      const todosCollection = collection(db, "todos");
      const q = query(todosCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const todos: Todo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        todos.push({
          id: doc.id,
          title: data.title,
          details: data.details,
          dueDate: data.dueDate,
          createdAt: (data.createdAt as Timestamp).toMillis(), 
        });
      });
      return todos;
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }