import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { Location } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selected = 'option2';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  check_boolean: string = "0";
  string = 'Select';
  oecd: string = '';
  year: string = '';
  province: string = '';

  oecd1: string = '';
  year1: string = '';
  province1: string = '';

  facetYear: any[] = [];
  facetOecd: any[] = [];
  facetProvince: any[] = [];
  facetField: string = '';
  booleanFilter: string = '';
  test: string = '';
  numfound: any;
  selectedValue: string = '';
  state: any = {};
  book: any[] = [];
  detail: any[] = [];
  click: string = '';
  isLoading = true;
  selectedOECD: string = '';
  selectedYear: string = '';
  selectedProvince: string = '';
  isActive = false;
  keyword : string = '';

  myForm: FormGroup;
  constructor(private http: HttpClient, private route: ActivatedRoute,private location: Location) {

    this.myForm = new FormGroup({
      oecd: new FormControl()
    });
  }

  form: FormGroup = new FormGroup({
    keyword: new FormControl('', Validators.required),
  });


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.search('*');
    });
    this.state.book = this.book;
    this.state.numfound = this.numfound;
    this.state.year = this.facetYear;
    this.state.click = this.click;
    this.state.facetField = this.facetField;
    this.state.booleanFilter = this.booleanFilter;
    this.state.oecd = this.oecd,
    this.state.year = this.year,
    this.state.province = this.province
    this.state.keyword = this.keyword 

  }

  onSelect(event: Event) {
    this.selectedValue = (event.target as HTMLSelectElement).value;
    console.log(this.selectedValue);
    this.searchOECD(this.selectedValue)
    this.searchYear(this.selectedValue)
  }

  getDataBoolean(keyword:string) {
    this.booleanFilter = keyword + " " + this.selectedOECD + " " + this.selectedYear + " " + this.selectedProvince

    this.selectedOECD= this.selectedOECD=== "" ? "*" : this.selectedOECD
    this.selectedYear = this.selectedYear === "" ? "*" : this.selectedYear;
    this.selectedProvince = this.selectedProvince === "" ? "*" : this.selectedProvince;
    keyword = keyword === "" ? "*" : keyword;



    this.book = [];
    this.facetField = ""
    let baseUrl =""
    if (this.year1 || this.province1 || this.oecd1) {
      if (this.oecd1 !== "") {
        this.selectedOECD = ""
        this.selectedOECD = this.oecd1;
      }
      if (this.year1 !== "") {
        this.selectedYear = ""
        this.selectedYear = this.year1;
      }
      if (this.province1 !== "") {
        this.selectedProvince=""
        this.selectedProvince = this.province1;
      }

      this.year1 = "";
      this.province1 = "";
      this.oecd1 = "";
    }
   
    baseUrl = `http://localhost:8080/getDataBoolean/` + this.selectedYear  + `/` + this.selectedProvince + `/` +  this.selectedOECD + `/` + keyword

    axios.get(baseUrl)
      .then((response) => {
        this.book = response.data.response.docs;
        this.numfound = response.data.response.numFound;
        this.addYearFact(response.data.facet_counts.facet_fields.ProjectYearSubmit)
        this.addOecdFact(response.data.facet_counts.facet_fields.OECD1)
        this.addProvinceFact(response.data.facet_counts.facet_fields.SubmitDepProvinceTH)
      })
      .catch(error => console.error(error));


      this.selectedOECD= this.selectedOECD=== "*" ? "" : this.selectedOECD
      this.selectedYear = this.selectedYear === "*" ? "" : this.selectedYear;
      this.selectedProvince = this.selectedProvince === "*" ? "" : this.selectedProvince;
  }


  getDataByFact(key: string, value: string) {
    this.book = [];
    this.facetField = ""
    let baseUrl = "";
    this.oecd1 = "";
    this.year1= "";
    this.province1 = "";

    if(this.check_boolean == "0"){
      baseUrl = `http://localhost:8080/getDataByFact/` + key + `/` + value
      axios.get(baseUrl)
      .then((response) => {
        this.book = response.data.response.docs;
        this.numfound = response.data.response.numFound;
        this.facetField = value
      })
      .catch(error => console.error(error));
    }
    else{
      if(key === "OECD1"){
        this.oecd1 = value
      }else if (key ===  "ProjectYearSubmit"){
        this.year1 = value

      }else if(key ===  "SubmitDepProvinceTH"){
        this.province1 = value
      }

   
      this.getDataBoolean(this.keyword)
      this.booleanFilter = this.keyword + " " + this.selectedOECD + " " + this.selectedYear + " " + this.selectedProvince

    }

  }

  submit() {
    this.booleanFilter = "";
    if (this.form.valid) {
      this.keyword = this.form.controls['keyword'].value
      this.check_boolean = "1"  
      if (this.selectedOECD || this.selectedYear || this.selectedProvince) {
        
        this.getDataBoolean(this.keyword )
      } else{
        this.search(this.keyword );
        this.booleanFilter = this.keyword 
      }

    } else {
      if (this.selectedOECD || this.selectedYear || this.selectedProvince) {
        this.getDataBoolean("")
      } else {
        this.check_boolean = "0"
        this.search("*");
      }

    }
  }

  addYearFact(list: any) {
    this.facetYear = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (i % 2 === 0) {
        this.facetYear.push({ data: element, count: list[i + 1] });
      }
    }
  }

  addProvinceFact(list: any) {
    this.facetProvince = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (i % 2 === 0) {
        this.facetProvince.push({ data: element, count: list[i + 1] });
      }
    }
  }

  addOecdFact(list: any) {
    this.facetOecd = [];
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      if (i % 2 === 0) {
        this.facetOecd.push({ data: element, count: list[i + 1] });
      }
    }
  }


  search(keyword: string) {
    this.book = [];
    this.facetField = ""
    this.booleanFilter = ""
    let baseUrl = `http://localhost:8080/getsolr/` + keyword;
    axios.get(baseUrl)
      .then((response) => {
        this.book = response.data.response.docs;
        this.numfound = response.data.response.numFound;
        this.addYearFact(response.data.facet_counts.facet_fields.ProjectYearSubmit)
        this.addOecdFact(response.data.facet_counts.facet_fields.OECD1)
        this.addProvinceFact(response.data.facet_counts.facet_fields.SubmitDepProvinceTH)
        this.isLoading = false;
      })
      .catch(error => console.error(error));


  }

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
      baseUrl = `http://localhost:8080/getsolr/` + oecd;
    } else {
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


}
