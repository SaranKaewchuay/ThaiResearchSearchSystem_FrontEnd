import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import axios from 'axios';


@Component({
  selector: 'app-research-detail',
  templateUrl: './research-detail.component.html',
  styleUrls: ['./research-detail.component.css']
})
export class ResearchDetailComponent {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //authorization: ''
    }),
  };
  detail : any[] = [];
  isLoading = true;

  constructor(private http: HttpClient,private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id_detail = params['id'];
      this.getDataByID(id_detail)
    });
  }
  
  getDataByID(id: string) {
    this.detail = [];   
    let baseUrl = `http://localhost:8080/getbyid/` + id;
    axios.get(baseUrl)
      .then((response) => {
        this.detail = response.data.response.docs;
        this.isLoading = false;
      })
      .catch(error => console.error(error));
  }
}

