// @flow
import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class Case {
  id: number;
  title: string;
  text: string;
  img: string;
  category: number;
  importance: number;
}

class CaseService {
  getCases(): Promise<Case[]> {
    return axios.get('/cases');
  }

  getCase(id: number): Promise<Case> {
    return axios.get('/cases/' + id);
  }

  updateCase(casex: Case): Promise<void> {
    return axios.put('/cases', casex);
  }
    createCase(title: string, text: string, img: string, category: number, importance: number) {
        return axios.post('/cases', {
            title: title,
            text: text,
            img: img,
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
}
export let caseService = new CaseService();
