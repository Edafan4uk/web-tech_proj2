# Bookstore
Web application for an imaginary bookstore.
* Full-stack web app based on **Asp.net Core 2.1, Angular6 and MSSQL**
* Authentication and role-based authorization via **JWT**
* Backend Rest API based on **Asp.net Core web Api**
* Fronted application based on **Angular 6, Bootstrap4 and RxJS**
* **MS SQL Server** along with **EF Core Code First** approach for DB

Repository structure
* *web-tech_proj2/BookStore/BookStore* - **contains Asp.net Core web API project**
  * */Controllers* - controller classes(i.e. endpoints)
  * */Helpers* - utility classes
  * */ViewModels* - DTO classes to interact with 'clients'
* *web-tech_proj2/BookStore/BookStore/BookStoreClient* - **Angular 6 application**
* *web-tech_proj2/BookStore/DAL* - **Data Access Layer**
  * */Data/BookStoreContext.cs* - configured 'IdentityDbContext' class
  * */Models* - Code-First domain classes
  * */Configurations* - configuration classes, which configure all DB mappings along with table relationships
  * */Migrations* - EF Core migrations
