package irwing.moura.todo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "List")
public class List {

    @Transient
    public static final String SEQUENCE_NAME = "users_sequence";

    @Id
    private Long id;
    private String name;

    @DBRef
    private java.util.List<Task> tasks;

    public java.util.List<Task> getTasks() {
        if(this.tasks == null) {
            return new ArrayList<>();
        }
        return this.tasks;
    }
}
