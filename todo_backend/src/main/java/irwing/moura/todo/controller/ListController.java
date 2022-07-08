package irwing.moura.todo.controller;

import irwing.moura.todo.model.List;
import irwing.moura.todo.model.Task;
import irwing.moura.todo.service.ListService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/list")
public class ListController {


    // TODO: 04/05/2022 ACABAR COM ENDPOINT DE ALTERAR NOME E COLOCAR UDPDATE DE TODA A LISTA DE UMA VEZ NO /{id}/update-tasks,
    //  JA COM AS TASKS. ESSE UPDATE OCORRERÁ SEMPRE QUE O USUÁRIO MUDAR DE PÁGINA OU DE TEMPO EM TEMPO, EVITANDO A CRIAÇÃO DE BOTÃO PARA SAVE.
    //  PRIMEREIRAMENTE OS DADOS DA LISTA IRÃO FICAR SALVOS EM MEMÓRIA NO FRONTEND, MELHORANDO QUESTÃO DE VELOCIDADE


    private final ListService service;

    public ListController(ListService service) {
        this.service = service;
    }


    @PostMapping
    public ResponseEntity<List> create(@RequestBody List list) {
        return new ResponseEntity<>(service.save(list), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List> read(@PathVariable("id") Long id) {
        return new ResponseEntity<>(service.getOne(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<java.util.List<List>> readAll() {
        return new ResponseEntity<>(service.getAll(), HttpStatus.OK);
    }

    @PutMapping()
    public ResponseEntity<List> updateName(@RequestBody List list) {
        return new ResponseEntity<>(service.updateName(list), HttpStatus.OK);
    }

    @PutMapping("/update-tasks")
    public ResponseEntity<List> updateListTasks(@RequestBody List list) {
        return new ResponseEntity<>(service.updateTasksFromList(list), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }


}

