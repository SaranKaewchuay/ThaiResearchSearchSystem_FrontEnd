import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, Validators ,FormBuilder} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';



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

  check_boolean: boolean = false;
  string = 'Select';
  oecd: string = '';
  year: string = '';
  province: string = '';
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

  myForm: FormGroup;
  constructor(private http: HttpClient, private route: ActivatedRoute) { 

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
    
  }

  onSelect(event: Event) {
    this.selectedValue = (event.target as HTMLSelectElement).value;
    console.log(this.selectedValue);
    this.searchOECD(this.selectedValue)
    this.searchYear(this.selectedValue)
  }

  getDataBoolean() {
    this.check_boolean = true
    this.oecd = this.selectedOECD
    this.year = this.selectedYear
    this.province =  this.selectedProvince
    this.booleanFilter = this.oecd + " " + this.year + " " + this.province

    this.oecd = this.oecd === "" ? "*" : this.oecd;
    this.year = this.year === "" ? "*" : this.year;
    this.province = this.province === "" ? "*" : this.province;
    this.book = [];
    this.facetField = ""

    let baseUrl = `http://localhost:8080/getDataBoolean/` + this.year + `/` + this.province + `/` + this.oecd
    axios.get(baseUrl)
      .then((response) => {
        this.book = response.data.response.docs;
        this.numfound = response.data.response.numFound;
        this.addYearFact(response.data.facet_counts.facet_fields.ProjectYearSubmit)
        this.addOecdFact(response.data.facet_counts.facet_fields.OECD1)
        this.addProvinceFact(response.data.facet_counts.facet_fields.SubmitDepProvinceTH)
      })
      .catch(error => console.error(error));


      this.oecd = this.oecd === "*" ? "" : this.oecd;
      this.year = this.year === "*" ? "" : this.year;
      this.province = this.province === "*" ? "" : this.province;
  }

  
  getDataByFact(key: string, value: string) {

    this.book = [];
    this.facetField = ""
    let baseUrl = `http://localhost:8080/getDataByFact/` + key + `/` + value
    axios.get(baseUrl)
      .then((response) => {
        this.book = response.data.response.docs;
        this.numfound = response.data.response.numFound;
        this.facetField = value
      })
      .catch(error => console.error(error));

  }
  
  submit() {
    this.booleanFilter = "";
    if (this.form.valid) {
      let keyword = this.form.controls['keyword'].value
      this.search(keyword);
      this.booleanFilter = keyword
      this.selectedOECD = "";
      this.selectedYear = "";
      this.selectedProvince = "";
    } else {
      if(this.selectedOECD || this.selectedYear || this.selectedProvince){
        this.getDataBoolean()
      }else{
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
    this.oecd = ""
    this.year = ""
    this.province = ""
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
      this.check_boolean = false;
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
