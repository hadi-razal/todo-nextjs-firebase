import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";

import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import {
    collection,
    addDoc,
    getDocs,
    where,
    query,
    deleteDoc,
    updateDoc,
    doc
} from "firebase/firestore"
import { db } from "/firebase/firebase.js"


export default function Home() {

    const router = useRouter()

    const [todoInput, setTodoInput] = useState("")
    const [todos, setTodos] = useState([])
    const { authUser, isLoading, signOut } = useAuth()

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push("/login")
        }
        if (!!authUser) {
            fetchTodos(authUser.uid)
        }
    }, [authUser, isLoading])

    const addTodo = async () => {
        try {
            // Add a new document with a generated id.
            const docRef = await addDoc(collection(db, "todos"), {
                owner: authUser.uid,
                content: todoInput,
                completed: false
            });
            console.log("Document written with ID: ", docRef.id);
            fetchTodos(authUser.uid)
            setTodoInput("")
        } catch (error) {
            console.log(error)
        }
    }

    const fetchTodos = async (uid) => {
        try {
            const q = query(collection(db, "todos"), where("owner", "==", uid));
            const querySnapshot = await getDocs(q);
            const data = []
            querySnapshot.forEach((doc) => {
                console.log(doc.id, " => ", doc.data());
                data.push({ ...doc.data(), id: doc.id })
            });
            setTodos(data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteTodo = async (docId) => {
        try {
            await deleteDoc(doc(db, "todos", docId))
            fetchTodos(authUser.uid)
        } catch (error) {
            console.log(error)
        }
    }


    const markAsCompleted = async (e, docId) => {
        try {
            const docRef = doc(db, "todos", docId)
            await updateDoc(docRef, {
                completed: e.target.checked
            })
            fetchTodos(authUser.uid)
        } catch (error) {
            console.log(error)
        }
    }

    const onKeyUp = (e) => {
        if (e.key === "Enter") {
            addTodo()
        }

    }

    return !authUser ? <Loader /> : (
        <main className="">
            <div className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
                onClick={signOut}>
                <GoSignOut size={18} />
                <span>Logout</span>
            </div>
            <div className="max-w-3xl mx-auto mt-10 p-8">
                <div className="bg-white -m-6 p-3 sticky top-0">
                    <div className="flex justify-center flex-col items-center">
                        <span className="text-7xl mb-10">📝</span>
                        <h1 className="text-5xl md:text-7xl font-bold">
                            ToooDooo's
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 mt-10">
                        <input
                            placeholder={`👋 ${authUser.username}, What to do Today?`}
                            type="text"
                            className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
                            autoFocus
                            value={todoInput}
                            onKeyUp={onKeyUp}
                            onChange={(e) => setTodoInput(e.target.value)}
                        />
                        <button onClick={addTodo} className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]">
                            <AiOutlinePlus size={30} color="#fff" />
                        </button>
                    </div>
                </div>
                <div className="my-10">
                    {todos.length > 0 && todos.map((todo) => (
                        <div key={todo.id} className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3">
                                <input
                                    id={`todo-${todo.id}`}
                                    type="checkbox"
                                    checked={todo.completed}
                                    onChange={(e) => markAsCompleted(e, todo.id)}
                                    className=" w-4 h-4 accent-green-400 rounded-lg"

                                />
                                <label
                                    htmlFor={`todo-${todo.id}`}
                                    className={` font-medium  ${!todo.completed ? null : "line-through"} `}
                                >
                                    {todo.content}
                                </label>
                            </div>

                            <div className="flex items-center gap-3" onClick={() => deleteTodo(todo.id)}>
                                <MdDeleteForever
                                    size={24}
                                    className="text-red-400 hover:text-red-600 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
