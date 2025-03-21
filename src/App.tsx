import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import {
  AiOutlinePlus,
  AiOutlineRobot,
  AiOutlineAudio,
  AiOutlinePauseCircle,
  AiOutlinePlayCircle,
  AiOutlineBell,
  AiOutlineCheckCircle,
  AiOutlineTrophy,
  AiOutlineCalendar,
} from "react-icons/ai";
import { parseDate } from "chrono-node";
import { FC } from "react";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  notes: string;
  subtasks: { text: string; completed: boolean }[];
  priority: "Low" | "Medium" | "High";
  deadline?: Date;
}

interface Achievement {
  title: string;
  unlocked: boolean;
}

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [notes, setNotes] = useState("");
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark" | "ocean" | "forest">("light");
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [user, setUser] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dailyGoal] = useState(5);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [motivationalQuote] = useState("Start small, win big!");
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [achievements] = useState<Achievement[]>([
    { title: "First Task", unlocked: false },
    { title: "5-Day Streak", unlocked: false },
  ]);

  const themes = {
    light: "bg-gray-100 text-black",
    dark: "bg-gray-900 text-white",
    ocean: "bg-blue-200 text-blue-900",
    forest: "bg-green-200 text-green-900",
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPomodoroRunning && pomodoroTime > 0) {
      interval = setInterval(() => setPomodoroTime((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroTime]);

  const addTask = () => {
    if (!newTask.trim()) return;
    const parsed = parseDate(newTask);
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      notes,
      subtasks: subtasks.map((text) => ({ text, completed: false })),
      priority,
      deadline: parsed || deadline,
    };
    setTasks([...tasks, task]);
    setNewTask("");
    setNotes("");
    setSubtasks([]);
    setPriority("Low");
    setDeadline(undefined);
  };

  const toggleTaskCompletion = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    if (updatedTasks[index].completed) {
      setXp(xp + 10);
      setCompletedTasks(completedTasks + 1);
      if (completedTasks + 1 >= dailyGoal) setStreak(streak + 1);
    }
    setTasks(updatedTasks);
  };

  const suggestTask = () => {
    setNewTask("Take a 5-minute break");
  };

  const login = () => {
    if (email && password) setUser(email);
  };

  const logout = () => {
    setUser(null);
    setEmail("");
    setPassword("");
  };

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event: SpeechRecognitionEvent) => setNewTask(event.results[0][0].transcript);
      recognition.start();
    } else {
      console.log("Speech recognition not supported");
    }
  };

  const filteredTasks = tasks
    .filter((task) =>
      filter === "all" ? true : filter === "completed" ? task.completed : !task.completed
    )
    .filter((task) => task.text.toLowerCase().includes(searchQuery.toLowerCase()));

  if (!user) {
    return (
      <div className="p-6 min-h-screen flex flex-col items-center bg-gray-100">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-600">AI To-Do List Pro</h1>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="mb-2 w-64" />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="mb-2 w-64"
        />
        <Button onClick={login} className="bg-blue-500 hover:bg-blue-700 text-white">
          Login / Register
        </Button>
      </div>
    );
  }

  return (
    <div className={`p-6 min-h-screen flex flex-col items-center ${themes[theme]}`}>
      <motion.h1 className="text-4xl font-extrabold mb-4 text-indigo-600" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        ⚡ AI To-Do List Pro ⚡
      </motion.h1>
      <div className="flex gap-2 mb-4">
        <select onChange={(e) => setTheme(e.target.value as typeof theme)} value={theme} className="border p-2 rounded">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="ocean">Ocean</option>
          <option value="forest">Forest</option>
        </select>
        <Button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white">
          Logout
        </Button>
        <Button onClick={() => setShowDashboard(true)} className="bg-green-500 hover:bg-green-700 text-white">
          Dashboard
        </Button>
      </div>
      <p className="mb-4 text-xl font-semibold text-purple-500">🌟 {motivationalQuote}</p>
      <p className="mb-4">
        🔥 Streak: {streak} | XP: {xp} | Daily Goal: {completedTasks}/{dailyGoal}
      </p>

      {/* Pomodoro Timer */}
      <div className="mb-4 flex gap-2 items-center">
        <p>
          Pomodoro: {Math.floor(pomodoroTime / 60)}:{(pomodoroTime % 60).toString().padStart(2, "0")}
        </p>
        <Button onClick={() => setIsPomodoroRunning(!isPomodoroRunning)}>
          {isPomodoroRunning ? (
            (AiOutlinePauseCircle as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6", "aria-hidden": "true" })
          ) : (
            (AiOutlinePlayCircle as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6", "aria-hidden": "true" })
          )}
        </Button>
        <Button onClick={() => setPomodoroTime(25 * 60)}>Reset</Button>
      </div>

      <div className="w-full max-w-xl">
        {/* Task Input */}
        <div className="flex flex-col gap-2 mb-4">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="🚀 Enter a task..."
            className="mb-2"
          />
          <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." className="mb-2" />
          <Input
            value={subtasks.join(",")}
            onChange={(e) => setSubtasks(e.target.value.split(",").filter(Boolean))}
            placeholder="Subtasks (comma-separated)"
            className="mb-2"
          />
          <div className="flex gap-2">
            <select
              onChange={(e) => setPriority(e.target.value as typeof priority)}
              value={priority}
              className="border p-2 rounded"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <Button onClick={addTask} className="bg-blue-500 hover:bg-blue-700 text-white">
              {(AiOutlinePlus as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6 mr-2", "aria-hidden": "true" })} Add
            </Button>
            <Button onClick={suggestTask} className="bg-purple-500 hover:bg-purple-700 text-white">
              {(AiOutlineRobot as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6 mr-2", "aria-hidden": "true" })} Suggest
            </Button>
            <Button onClick={startVoiceInput} className="bg-teal-500 hover:bg-teal-700 text-white">
              {(AiOutlineAudio as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6 mr-2", "aria-hidden": "true" })} Voice
            </Button>
          </div>
        </div>

        <Calendar
          onSelect={(date: Date | undefined) => setDeadline(date)}
          selected={deadline}
          className="mb-4"
        />

        {/* Filter and Search */}
        <div className="flex gap-2 mb-4">
          <select
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            value={filter}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
          />
          <select
            onChange={(e) => setLanguage(e.target.value as typeof language)}
            value={language}
            className="border p-2 rounded"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Task List */}
        {filteredTasks.map((task, index) => {
          const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed;
          return (
            <Card
              key={task.id}
              className={`mb-2 border-l-4 ${isOverdue ? "bg-red-200" : task.completed ? "bg-green-200" : "bg-white"} ${
                {
                  Low: "border-green-500",
                  Medium: "border-yellow-500",
                  High: "border-red-500",
                }[task.priority]
              } shadow-md rounded-lg p-4`}
            >
              <CardContent className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className={`${task.completed ? "line-through text-gray-500" : "text-black"}`}>
                    {task.text}
                  </span>
                  <div className="flex gap-2 items-center">
                    {(AiOutlineBell as FC<{ className?: string; "aria-hidden"?: string; title?: string }>) ({ className: "w-6 h-6 cursor-pointer", "aria-hidden": "true", title: "Reminder" })}
                    {(AiOutlineCheckCircle as FC<{ className?: string; "aria-hidden"?: string; title?: string; onClick?: () => void }>) ({
                      className: "w-6 h-6 cursor-pointer text-green-600",
                      "aria-hidden": "true",
                      title: "Complete Task",
                      onClick: () => toggleTaskCompletion(index),
                    })}
                    {(AiOutlineTrophy as FC<{ className?: string; "aria-hidden"?: string; title?: string }>) ({ className: "w-6 h-6 text-yellow-500", "aria-hidden": "true", title: "XP Points" })}
                  </div>
                </div>
                {task.notes && <p className="text-sm text-gray-500">{task.notes}</p>}
                {task.subtasks.length > 0 && (
                  <ul className="text-sm text-gray-500">
                    {task.subtasks.map((sub, i) => (
                      <li key={i}>
                        {sub.completed ? "✓" : "○"} {sub.text}
                      </li>
                    ))}
                  </ul>
                )}
                {task.deadline && (
                  <p className="text-sm text-gray-500">
                    {(AiOutlineCalendar as FC<{ className?: string; "aria-hidden"?: string }>) ({ className: "w-6 h-6 inline mr-2", "aria-hidden": "true" })}{" "}
                    {task.deadline.toDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Dashboard Modal */}
        {showDashboard && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-2xl mb-4">Progress Dashboard</h2>
              <p>Tasks Completed: {completedTasks}</p>
              <p>XP Earned: {xp}</p>
              <p>Streak: {streak}</p>
              <p>
                Achievements Unlocked: {achievements.filter((a) => a.unlocked).length}/{achievements.length}
              </p>
              <Button onClick={() => setShowDashboard(false)} className="mt-4">
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Tutorial Modal */}
        {showTutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-2xl mb-4">Welcome to AI To-Do List Pro!</h2>
              <p>1. Add a task using the input above.</p>
              <p>2. Set priorities and deadlines.</p>
              <p>3. Earn XP and track your streak!</p>
              <Button onClick={() => setShowTutorial(false)} className="mt-4">
                Got It!
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;