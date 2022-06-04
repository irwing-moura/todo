package irwing.moura.todo.controller;

import irwing.moura.todo.model.Task;
import irwing.moura.todo.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/task")
public class TaskController {


    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    // TODO: 17/04/2022 ADICIONAR VALIDAÇÕES @Valid

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        return new ResponseEntity<>(service.save(task), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> read(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOne(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Task>> readAll() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<Task> update(@RequestBody Task task) {
        return new ResponseEntity<>(service.update(task), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAll() {
        service.deleteAll();
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/favorite")
    public ResponseEntity<Task> favorite(@PathVariable Long id) {
        return new ResponseEntity<>(service.favorite(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/remind")
    public ResponseEntity<Task> remind(@PathVariable Long id,
                                       @RequestParam(name = "time") LocalDateTime time) {
        return new ResponseEntity<>(service.remind(id, time), HttpStatus.OK);
    }

    @PutMapping("/{id}/done")
    public ResponseEntity<Task> done(@PathVariable Long id) {
        return new ResponseEntity<>(service.done(id), HttpStatus.OK);
    }

}
