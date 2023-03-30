import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';



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
  numfound: any;
  book: any[] = [];
  detail : any[] = [];
  facetAuthor: facetDisplay[] = [];
  facetPublisher: facetDisplay[] = [];

  constructor(private http: HttpClient,private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id_detail = params['id'];
      this.searchDetail(id_detail)
    });
  }
  

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