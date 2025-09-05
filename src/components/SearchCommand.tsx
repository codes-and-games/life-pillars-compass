import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Target, Eye, BookOpen, Clock, Calendar } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useJournals } from "@/hooks/useJournals";
import { useVisions } from "@/hooks/useVisions";
import { useTimeLogs } from "@/hooks/useTimeLogs";
import { useNavigate } from "react-router-dom";

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SearchCommand = ({ open, setOpen }: SearchCommandProps) => {
  const [search, setSearch] = useState("");
  const { goals } = useGoals();
  const { journals } = useJournals();
  const { visions } = useVisions();
  const { timeLogs } = useTimeLogs();
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const handleSelect = (type: string, path?: string) => {
    setOpen(false);
    if (path) {
      navigate(path);
    }
  };

  const filteredGoals = goals.filter(goal =>
    goal.title.toLowerCase().includes(search.toLowerCase()) ||
    goal.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredJournals = journals.filter(journal =>
    journal.title.toLowerCase().includes(search.toLowerCase()) ||
    journal.content.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVisions = visions.filter(vision =>
    vision.title.toLowerCase().includes(search.toLowerCase()) ||
    vision.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTimeLogs = timeLogs.filter(log =>
    log.activity.toLowerCase().includes(search.toLowerCase()) ||
    log.notes?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Search goals, journals, visions, time logs..." 
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {filteredGoals.length > 0 && (
          <CommandGroup heading="Goals">
            {filteredGoals.slice(0, 5).map((goal) => (
              <CommandItem
                key={goal.id}
                onSelect={() => handleSelect("goal", "/goals")}
              >
                <Target className="mr-2 h-4 w-4" />
                <span>{goal.title}</span>
                {goal.status === 'completed' && (
                  <span className="ml-auto text-xs text-success">Completed</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredJournals.length > 0 && (
          <CommandGroup heading="Journals">
            {filteredJournals.slice(0, 5).map((journal) => (
              <CommandItem
                key={journal.id}
                onSelect={() => handleSelect("journal", "/journals")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                <span>{journal.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {new Date(journal.entry_date).toLocaleDateString()}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredVisions.length > 0 && (
          <CommandGroup heading="Visions">
            {filteredVisions.slice(0, 5).map((vision) => (
              <CommandItem
                key={vision.id}
                onSelect={() => handleSelect("vision", "/visions")}
              >
                <Eye className="mr-2 h-4 w-4" />
                <span>{vision.title}</span>
                {vision.is_achieved && (
                  <span className="ml-auto text-xs text-success">Achieved</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredTimeLogs.length > 0 && (
          <CommandGroup heading="Time Logs">
            {filteredTimeLogs.slice(0, 5).map((log) => (
              <CommandItem
                key={log.id}
                onSelect={() => handleSelect("timelog", "/time-logs")}
              >
                <Clock className="mr-2 h-4 w-4" />
                <span>{log.activity}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {log.duration_minutes}min
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandGroup heading="Pages">
          <CommandItem onSelect={() => handleSelect("page", "/")}>
            <Calendar className="mr-2 h-4 w-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("page", "/goals")}>
            <Target className="mr-2 h-4 w-4" />
            Goals
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("page", "/visions")}>
            <Eye className="mr-2 h-4 w-4" />
            Visions
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("page", "/journals")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Journals
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("page", "/time-logs")}>
            <Clock className="mr-2 h-4 w-4" />
            Time Logs
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};