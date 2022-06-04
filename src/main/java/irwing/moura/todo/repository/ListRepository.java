package irwing.moura.todo.repository;

import irwing.moura.todo.model.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ListRepository extends MongoRepository<List, Long> {
}
