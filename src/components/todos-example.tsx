import type { FormEvent } from "react"
// import { CloseOutlined } from "@ant-design/icons"
// import { a, useTransition } from "@react-spring/web"
// import { Radio } from "antd"
import type { PrimitiveAtom } from "jotai"
import { Provider, atom, createStore, useAtom, useSetAtom } from "jotai"
import { DevTools } from "jotai-devtools"
import "jotai-devtools/styles.css"
import { XCircle } from "lucide-react"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

type Todo = {
  title: string
  completed: boolean
}

const todosStore = createStore()

const filterAtom = atom("all")
const todosAtom = atom<PrimitiveAtom<Todo>[]>([])
todosAtom.debugLabel = "todosAtom"
const filteredAtom = atom<PrimitiveAtom<Todo>[]>((get) => {
  const filter = get(filterAtom)
  const todos = get(todosAtom)
  if (filter === "all") return todos
  else if (filter === "completed")
    return todos.filter((atom) => get(atom).completed)
  else return todos.filter((atom) => !get(atom).completed)
})

type RemoveFn = (item: PrimitiveAtom<Todo>) => void
type TodoItemProps = {
  atom: PrimitiveAtom<Todo>
  remove: RemoveFn
}
const TodoItem = ({ atom, remove }: TodoItemProps) => {
  const [item, setItem] = useAtom(atom)
  const toggleCompleted = () =>
    setItem((props) => ({ ...props, completed: !props.completed }))
  return (
    <>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={toggleCompleted}
      />
      <span style={{ textDecoration: item.completed ? "line-through" : "" }}>
        {item.title}
      </span>
      <XCircle onClick={() => remove(atom)} />
    </>
  )
}

const Filter = () => {
  const [filter, set] = useAtom(filterAtom)
  // return (
  //   <Radio.Group onChange={(e) => set(e.target.value)} value={filter}>
  //     <Radio value="all">All</Radio>
  //     <Radio value="completed">Completed</Radio>
  //     <Radio value="incompleted">Incompleted</Radio>
  //   </Radio.Group>
  // )
  return (
    <RadioGroup className="w-fit" value={filter} onValueChange={set}>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="all" id="r1" />
        <Label htmlFor="r1">All</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="completed" id="r2" />
        <Label htmlFor="r2">Completed</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="incompleted" id="r3" />
        <Label htmlFor="r3">Incompleted</Label>
      </div>
    </RadioGroup>
  )
}

type FilteredType = {
  remove: RemoveFn
}
const Filtered = (props: FilteredType) => {
  const [todos] = useAtom(filteredAtom)
  // const transitions = useTransition(todos, {
  //   keys: (todo) => todo.toString(),
  //   from: { opacity: 0, height: 0 },
  //   enter: { opacity: 1, height: 40 },
  //   leave: { opacity: 0, height: 0 },
  // })
  // return transitions((style, atom) => (
  //   <a.div className="item" style={style}>
  //     <TodoItem atom={atom} {...props} />
  //   </a.div>
  // ))
  return (
    <div>
      {todos.map((atom) => (
        <div key={atom.toString()} className="item">
          <TodoItem atom={atom} {...props} />
        </div>
      ))}
    </div>
  )
}

const TodoList = () => {
  // const [, setTodos] = useAtom(todosAtom)
  const setTodos = useSetAtom(todosAtom)
  const remove: RemoveFn = (todo) =>
    setTodos((prev) => prev.filter((item) => item !== todo))
  const add = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const title = e.currentTarget.inputTitle.value
    e.currentTarget.inputTitle.value = ""
    setTodos((prev) => [...prev, atom<Todo>({ title, completed: false })])
  }

  return (
    <form onSubmit={add}>
      <Filter />
      <input name="inputTitle" placeholder="Type ..." />
      <Filtered remove={remove} />
    </form>
  )
}

export function TodosExample() {
  return (
    <Provider store={todosStore}>
      <h1>Jōtai</h1>
      <TodoList />
      <DevTools store={todosStore} />
    </Provider>
  )
}
