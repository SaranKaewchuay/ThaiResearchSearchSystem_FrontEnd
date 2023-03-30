import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OnChanges, SimpleChanges } from '@angular/core';
import axios from 'axios';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent  {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      //authorization: ''
    }),
  };


  oecd: any[] = [
    "เกษตรศาสตร์",
    "สังคมศาสตร์",
    "วิทยาศาสตร์",
    "ธรรมชาติ",
    "วิศวกรรม",
    "เทคโนโลยี",
    "มนุษยศาสตร์",
    "สุขภาพ",
    "แพทย์",
    "อื่นๆ"
  ];

  year: any[] = [];
  numfound: any;
  selectedValue: string = '';
  state: any = {};
  book: any[] = [];
  detail: any[] = [];
  facetAuthor: facetDisplay[] = [];
  facetPublisher: facetDisplay[] = [];
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  form: FormGroup = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });

  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.search('*');
    });
    this.state.book = this.book;
    this.state.numfound = this.numfound;
    this.state.year = this.year;
  }


  onSelect(event: Event) {
    this.selectedValue = (event.target as HTMLSelectElement).value;
    console.log(this.selectedValue);
    this.searchOECD(this.selectedValue)
    this.searchYear(this.selectedValue)
  }


  submit() {
    if (this.form.valid) {
      this.search(this.form.controls['keyword'].value);
    }
  }

  addYearFact(list: any) {
    this.year = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (i % 2 === 0) {
        this.year.push({ data: element, count: list[i + 1] });
      }
    }
  }

  // search(keyword: string) {

  //   this.book = [];                      // เป็น model ที่สร้างจาก interface
  //   this.getData(keyword).subscribe((response: RootResponse) => {
  //     this.book = response.response.docs;
  //     this.numfound = response.response.numFound;
  //     //this.year = response;
  //     try {
  //       // this.addAuthorFacet(response.facet_counts.facet_fields.author);
  //       // this.addPublisherFacet(response.facet_counts.facet_fields.publisher);
  //     } catch (error) { }
  //   });

  // }

  
  search(keyword: string) {

    this.book = [];        
    let baseUrl = `http://localhost:8080/getsolr/` + keyword;
    axios.get(baseUrl)
    .then((response) => {
      this.book = response.data.response.docs;
      this.numfound = response.data.numFound;
      this.addYearFact(response.data.facet_counts.facet_fields.ProjectYearSubmit)
    })
    .catch(error => console.error(error));     


  }


  
  // getData(keyword: string) {
  //   let baseUrl = `http://localhost:8080/getsolr/` + keyword;
  //   return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  // }

  searchDetail(id: string) {
    this.detail = [];
    let baseUrl = `http://localhost:8080/getbyid/` + id;
    axios.get(baseUrl)
    .then((response) => {
      this.detail = response.data.response.docs;
    })
    .catch(error => console.error(error));     
  }

  searchOECD(oecd: string) {
    this.book = [];    
    let baseUrl;
    if (oecd == "*") {
      baseUrl = `http://localhost:8080/getsolr/`+ oecd;
    }else{
      baseUrl = `http://localhost:8080/getByOecd/` + oecd;
      
    }
    axios.get(baseUrl)
    .then((response) => {
      this.book = response.data.response.docs;
      this.numfound = response.data.response.numFound;
    })
    .catch(error => console.error(error));  
  }

  searchYear(year: string) {
    this.book = [];

    let baseUrl = `http://localhost:8080/getByYear/` + year;
    axios.get(baseUrl)
    .then((response) => {
      this.book = response.data.response.docs;
      this.numfound = response.data.response.numFound;
    })
    .catch(error => console.error(error));     

  }

  // addAuthorFacet(authorList: any) {
  //   this.facetAuthor = [];
  //   for (let i = 0; i < authorList.length; i++) {
  //     const element = authorList[i];
  //     if (i % 2 === 0) {
  //       this.facetAuthor.push({ data: element, count: authorList[i + 1] });
  //     }
  //   }
  // }

  // addPublisherFacet(publisherList: any) {
  //   this.facetPublisher = [];
  //   for (let i = 0; i < publisherList.length; i++) {
  //     const element = publisherList[i];
  //     if (i % 2 === 0) {
  //       this.facetPublisher.push({ data: element, count: publisherList[i + 1] });
  //     }
  //   }
  // }

  


  // getDataByID(id: string) {
  //   let baseUrl = `http://localhost:8080/getbyid/` + id;
  //   return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  // }



  // getDataByYear(year: string) {
  //   let baseUrl = `http://localhost:8080/getByYear/` + year;
  //   return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  // }

  // getDataFactYear() {
  //   let baseUrl = `http://localhost:8080/fact` ;
  //   return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  // }


    // getByOecd(oecd: string) {
  //   if (oecd == "ทั้งหมด") {
  //     return this.search("*")
  //   } else {
  //     let baseUrl = `http://localhost:8080/getByOecd/` + oecd;
  //     return this.http.get<RootResponse>(baseUrl, this.httpOptions);
  //   }

  // }

  // addOECD(list:any){
  //   this.Oecd = []
  //   for (let i = 0; i < list.length; i++) {
  //     const element = list[i];
  //     // if (i % 2 === 0) {
  //       this.Oecd.push({ data: element, count: list[i + 1] });
  //     // }
  //   }
  // }


  // get_ODCE(){
  //   this.getOecd().subscribe((response: RootResponse) => {
  //     this.addOECD(response.facet_counts.facet_fields);

  //     console.log("OCED == ",this.Oecd)
  //   })
  // }

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
  start: number;
  numFoundExact: boolean;
  docs: Doc[];
}

export interface FacetQueries { }

export interface FacetFields {
  author: any[];
  publisher: any[];
}

export interface FacetRanges { }

export interface FacetIntervals { }

export interface FacetHeatmaps { }

export interface FacetCounts {
  facet_queries: FacetQueries;
  facet_fields: FacetFields;
  facet_ranges: FacetRanges;
  facet_intervals: FacetIntervals;
  facet_heatmaps: FacetHeatmaps;
}

export interface RootResponse {
  [x: string]: any;
  responseHeader: ResponseHeader;
  response: Response;
  facet_counts: FacetCounts;
}