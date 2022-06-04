package irwing.moura.todo.service;

import irwing.moura.todo.model.Task;
import irwing.moura.todo.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    // TODO: 17/04/2022 CRIAR EXCEPTIONS

    private final TaskRepository taskRepository;
    private final SequenceGeneratorService sequenceGeneratorService;

    public TaskService(TaskRepository taskRepository, SequenceGeneratorService sequenceGeneratorService) {
        this.taskRepository = taskRepository;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public Task getOne(Long id) {
        Optional<Task> task = taskRepository.findById(id);
        return task.orElse(null);
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task save(Task task) {
        task.setId(sequenceGeneratorService.generateSequence(Task.SEQUENCE_NAME));
        task.setCreatedAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task update(Task task) {
        return taskRepository.save(task);
    }

    public List<Task> saveAll(List<Task> tasks) {
        return taskRepository.saveAll(tasks);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    public void deleteAll() {
        taskRepository.deleteAll();
    }

    public Task favorite(Long id) {
        Task task = getOne(id);
        task.setFavorite(true);
        return taskRepository.save(task);
    }

    public Task remind(Long id, LocalDateTime time) {
        Task task = getOne(id);
        task.setReminder(time);
        return taskRepository.save(task);
    }

    public Task done(Long id) {
        Task task = getOne(id);
        task.setDone(true);
        task.setDoneAt(LocalDateTime.now());
        return taskRepository.save(task);
    }

}
