package irwing.moura.todo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Document(collection = "Task")
public class Task {

    @Transient
    public static final String SEQUENCE_NAME = "users_sequence";

    @Id
    private Long id;
    private String name;
    private String description;

    //TRIGGERED BY CTA
    private Boolean favorite;
    private LocalDateTime reminder;
    private Boolean done;
    private LocalDateTime doneAt;

    //TRIGGERED BY NEW INSTANCE
    private LocalDateTime createdAt;


}
