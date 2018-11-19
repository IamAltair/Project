// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Category {
    id: number;
    type: string;
}

class Article {
    id: number;
    title: string;
    content: string;
    picture: string;
    category: string;
    importance: number;
}

class ArticleService {

    getCategories(): Promise<Category[]> {
        return axios.get('/categories');
    }

    getArticles(): Promise<Article[]> {
        return axios.get('/articles');
    }

    getArticle(id: number): Promise<article> {
        return axios.get('/articles/' + id);
    }

    createArticle(title: string, content: string, picture: string, category: string, importance: number): Promise<void> {
        return axios.post('/articles', {
            title: title,
            content: content,
            picture: picture,
            category: category,
            importance: importance
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    updateArticle(student: Student): Promise<void> {
        return axios.put('/articles', student);
    }

    deleteArticle(id: number): Promise<void> {
        return axios.delete('/articles/' + id);
    }

}

export let articleService = new ArticleService();

class Student {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

class StudentService {
    getStudents(): Promise<Student[]> {
        return axios.get('/students');
    }

    getStudent(id: number): Promise<Student> {
        return axios.get('/students/' + id);
    }

    updateStudent(student: Student): Promise<void> {
        return axios.put('/students', student);
    }
}

export let studentService = new StudentService();
