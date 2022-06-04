package irwing.moura.todo.service;

import irwing.moura.todo.model.List;
import irwing.moura.todo.model.Task;
import irwing.moura.todo.repository.ListRepository;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class ListService {


    private final ListRepository listRepository;
    private final TaskService taskService;
    private final SequenceGeneratorService sequenceGeneratorService;

    public ListService(ListRepository listRepository, TaskService taskService, SequenceGeneratorService sequenceGeneratorService) {
        this.listRepository = listRepository;
        this.taskService = taskService;
        this.sequenceGeneratorService = sequenceGeneratorService;
    }

    public List save(List list) {

        for (Task task: list.getTasks()) {
            taskService.save(task);
        }

        list.setId(sequenceGeneratorService.generateSequence(Task.SEQUENCE_NAME));
        return listRepository.save(list);
    }

    public List updateName(List list) {
//        List list = getOne(id);
//        list.setName(name);
        return listRepository.save(list);
    }

    public List updateTasksFromList(List list) {

        java.util.List<Task> tasksAlteradas = new ArrayList<>();

        if(list.getTasks().get(0) != null) {

            for (Task task: list.getTasks()) {

                //NEW
                if(task.getId() == null) {
                    task.setId(sequenceGeneratorService.generateSequence(Task.SEQUENCE_NAME));
                    task.setCreatedAt(LocalDateTime.now());
                    tasksAlteradas.add(taskService.save(task));
                }
                //UPDATE
                else {
                    tasksAlteradas.add(taskService.update(task));
                }
            }

            list.setTasks(tasksAlteradas);

            return listRepository.save(list);

        }

        return null;
    }

    public List getOne(Long id) {
        Optional<List> list = listRepository.findById(id);
        return list.orElse(null);
    }

    public java.util.List<List> getAll() {
        return listRepository.findAll();
    }

    public void delete(Long id) {
        listRepository.deleteById(id);
    }

    public void deleteAll() {
        listRepository.deleteAll();
    }


}
