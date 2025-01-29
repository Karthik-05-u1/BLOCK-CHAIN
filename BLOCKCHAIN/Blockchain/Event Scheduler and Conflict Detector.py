class Event:
    def __init__(self, name, start, end):
        self.name = name
        self.start = self.to_minutes(start)
        self.end = self.to_minutes(end)
    
    def to_minutes(self, time_str):
        hours, minutes = map(int, time_str.split(':'))
        return hours * 60 + minutes
    
    def conflicts_with(self, other):
        return not (self.end <= other.start or self.start >= other.end)

def suggest_alternative(existing_events, duration):
    available_slots = []
    start_of_day, end_of_day = 9 * 60, 18 * 60  # 9:00 to 18:00
    
    all_times = [(start_of_day, start_of_day)] + [(e.end, e.start) for e in existing_events] + [(end_of_day, end_of_day)]
    all_times.sort()
    
    for i in range(len(all_times) - 1):
        gap_start, gap_end = all_times[i][1], all_times[i + 1][0]
        if gap_end - gap_start >= duration:
            available_slots.append((gap_start, gap_start + duration))
    
    return [(f"{s//60:02}:{s%60:02}", f"{e//60:02}:{e%60:02}") for s, e in available_slots]

def detect_conflicts(events):
    conflicts = []
    for i, event in enumerate(events):
        for other in events[i+1:]:
            if event.conflicts_with(other):
                conflicts.append((event.name, other.name))
    return conflicts

existing_events = []
n = int(input("Enter the number of events: "))
for _ in range(n):
    name = input("Enter event name: ")
    start = input("Enter start time (HH:MM): ")
    end = input("Enter end time (HH:MM): ")
    existing_events.append(Event(name, start, end))

conflicts = detect_conflicts(existing_events)
if conflicts:
    print("Conflicting Events:")
    for e1, e2 in conflicts:
        print(f"- {e1} and {e2}")
else:
    print("No conflicts detected.")

alternative_slots = suggest_alternative(existing_events, 60)
print("\nSuggested Alternative Time Slots:")
for start, end in alternative_slots:
    print(f"- {start} to {end}")
