import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //authorization: ''
    }),
  };
  numfound: any;
  book: any[] = [];
  detail : any[] = [];
  facetAuthor: facetDisplay[] = [];
  facetPublisher: facetDisplay[] = [];
  constructor(private http: HttpClient,private route: ActivatedRoute) {}
  form: FormGroup = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id_detail = params['id'];
      this.search();
    });
  }
  

  submit() {
    if (this.form.valid) {
      this.search();

      // this.search(this.form.controls['keyword'].value);
    }
  }

  search() {
 
    this.book = [];                      // เป็น model ที่สร้างจาก interface
    this.getData().subscribe((response: RootResponse) => {
      this.book = response.response.docs;
      this.numfound= response.response.numFound;
      try {
        this.addAuthorFacet(response.facet_counts.facet_fields.author);
        this.addPublisherFacet(response.facet_counts.facet_fields.publisher);
      } catch (error) {}
    });

  }

  // search(keyword: string) {
 
  //   this.book = [];                      // เป็น model ที่สร้างจาก interface
  //   this.getData(keyword).subscribe((response: RootResponse) => {
  //     this.book = response.response.docs;
  //     this.numfound= response.response.numFound;
  //     try {
  //       this.addAuthorFacet(response.facet_counts.facet_fields.author);
  //       this.addPublisherFacet(response.facet_counts.facet_fields.publisher);
  //     } catch (error) {}
  //   });

  // }
  searchDetail(id: string) {
 
    this.detail = [];   
    this.getDataByID(id).subscribe((response: RootResponse) => {
      this.detail = response.response.docs;
      // this.numfound= response.response.numFound;
      try {
        // this.data_detail = response
      } catch (error) {}
    });

  }


 
  // search(keyword: string, id_detail: string) {
  // this.book = [];                      // เป็น model ที่สร้างจาก interface
  // let observable: Observable<RootResponse>;
  // if (id_detail) {
  //   observable = this.getDataByID(id_detail);
  // } else {
  //   observable = this.getData(keyword);
  // }

  addAuthorFacet(authorList: any) {
    this.facetAuthor=[];
    for (let i = 0; i < authorList.length; i++) {
      const element = authorList[i];
      if (i % 2 === 0) {
        this.facetAuthor.push({ data: element, count: authorList[i + 1] });
      }
    }
  }

  addPublisherFacet(publisherList: any) {
    this.facetPublisher=[];
    for (let i = 0; i < publisherList.length; i++) {
      const element = publisherList[i];
      if (i % 2 === 0) {
        this.facetPublisher.push({ data: element, count: publisherList[i + 1] });
      }
    }
  }

  getData() {
    let baseUrl = `http://localhost:8080/getsolr`;
    //console.log(environment.apiurl);
    return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  }

  // getData(keyword: string) {
  //   let baseUrl = `http://localhost:8080/getsolr/` + keyword;
  //   //console.log(environment.apiurl);
  //   return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  // }

  
  getDataByID(id: string) {
    let baseUrl = `http://localhost:8080/getbyid/` + id;
    return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  }
}



export interface facetDisplay {
  data: string;
  count: number;
}

export interface Params {
  q: string;
  facet: string;
  wt: string;
}

export interface ResponseHeader {
  status: number;
  QTime: number;
  params: Params;
}

export interface Doc {
  id: string;
  title: string;
  author: string;
  publisher: string;
  lang: string;
  pubyear: string;
  _version_: any;
  publisher_index: string;
}

export interface Response {
  numFound: number;
  // id_string:string,
  start: number;
  numFoundExact: boolean;
  docs: Doc[];
}

export interface FacetQueries {}

export interface FacetFields {
  author: any[];
  publisher: any[];
}

export interface FacetRanges {}

export interface FacetIntervals {}

export interface FacetHeatmaps {}

export interface FacetCounts {
  facet_queries: FacetQueries;
  facet_fields: FacetFields;
  facet_ranges: FacetRanges;
  facet_intervals: FacetIntervals;
  facet_heatmaps: FacetHeatmaps;
}

export interface RootResponse {
  responseHeader: ResponseHeader;
  response: Response;
  facet_counts: FacetCounts;
}