// src/app/page.tsx
import React from "react";

export default function Page() {
  return (
    <>
      {/* Header */}
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Logo</a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarScroll"
              aria-controls="navbarScroll"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarScroll">
              <ul
                className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
                style={{ ["--bs-scroll-height" as any]: "100px" }}
              >
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item"><a className="nav-link" href="#">Eventos</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Organiza tu Evento</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Sobre Nosotros</a></li>
                <li className="nav-item"><a className="nav-link" href="#">Contacto</a></li>
              </ul>

              <div className="navbar-buttons d-flex gap-2">
                <button className="btn btn-outline-primary">Iniciar</button>
                <button className="btn btn-primary">Registrarse</button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <div className="row row--padding row--centered">
        <div className="cell-start-1 cell-end-11 t-cell-start-0 t-cell-end-12">
          <h1 className="heading-1 js-animated--fade js-animated--fade__desc is-animated">
            Inicia sesión para gestionar o participar en diferentes <br />
            <span
              className="typer"
              id="main"
              data-words="Eventos, Viajes, Reuniones,"
              data-delay="80"
              data-deletedelay="3000"
              data-colors="#0032fa"
              style={{ color: "#3498DB" }}
            >
              eventos
            </span>
            <div className="cursor-container">
              <span
                className="cursor"
                data-owner="main"
                data-cursor-display="|"
                style={{ transition: "0.1s", opacity: 1 }}
              >
                |
              </span>
            </div>
          </h1>
        </div>

        <div className="o-rtf heading--sub js-animated--fade js-animated--fade__desc cell-start-3 cell-end-9 t-cell-start-1 t-cell-end-11 is-animated">
          <p>
            sadasdsdsa <a href="http://">asdasdas</a>
          </p>
        </div>
      </div>

      {/* Carousel */}
      <section className="main">
        <article className="wrapper">
          <div id="carouselExampleCaptions" className="carousel slide">
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              />
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2" />
              <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3" />
            </div>

            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="/img/images.jpg" className="d-block w-100" alt="slide 1" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>First slide label</h5>
                  <p>Some representative placeholder content for the first slide.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="/img/images.jpg" className="d-block w-100" alt="slide 2" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Second slide label</h5>
                  <p>Some representative placeholder content for the second slide.</p>
                </div>
              </div>
              <div className="carousel-item">
                <img src="/img/images.jpg" className="d-block w-100" alt="slide 3" />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>Some representative placeholder content for the third slide.</p>
                </div>
              </div>
            </div>

            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <span className="visually-hidden">Previous</span>
            </button>

            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </article>

        {/* Filtro + Cards */}
        <article className="main-search">
          <div className="cell-start-0 cell-end-12">
            <div className="form-selected">
              <select name="region" id="region-select" className="form-control" defaultValue="">
                <option value="" disabled>Selecciona una región</option>
                <option value="arica_parinacota">Arica y Parinacota</option>
                <option value="tarapaca">Tarapacá</option>
                <option value="antofagasta">Antofagasta</option>
                <option value="atacama">Atacama</option>
                <option value="coquimbo">Coquimbo</option>
                <option value="valparaiso">Valparaíso</option>
                <option value="metropolitana">Región Metropolitana</option>
                <option value="ohiggins">O'Higgins</option>
                <option value="maule">Maule</option>
                <option value="nuble">Ñuble</option>
                <option value="biobio">Biobío</option>
                <option value="araucania">La Araucanía</option>
                <option value="los_rios">Los Ríos</option>
                <option value="los_lagos">Los Lagos</option>
                <option value="aisen">Aysén</option>
                <option value="magallanes">Magallanes y Antártica Chilena</option>
              </select>
            </div>

            <form className="form--cta js-animated--fade js-animated--fade__desc is-animated search d-flex" action="" role="search">
              <input className="form-control me-2" type="search" placeholder="Buscar eventos" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit" aria-label="Buscar">
                {/* Ícono de búsqueda */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  className="bi bi-search" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </form>
          </div>

          <div className="card-container">
            {/* En tu HTML hay muchas cards repetidas; aquí lo generamos con un map para acortar */}
            {Array.from({ length: 9 }).map((_, i) => (
              <button className="card" id="cat-fest" key={i}>
                <img src="/img/images.jpg" className="card-img-top" alt="Imagen del evento" />

                <div className="content-card">
                  <h4 className="card-direction">Región Metropolitana</h4>
                  <h2 className="card-title">Fiesta Electrónica</h2>

                  <span className="card-description d-inline-flex align-items-center gap-2">
                    {/* Calendario */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                      className="bi bi-calendar2-week-fill calendar-icon" viewBox="0 0 16 16">
                      <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5m9.954 3H2.545c-.3 0-.545.224-.545.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5M8.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 10.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5m3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                    </svg>

                    <span className="event-date">
                      <span id="start-date">15 nov</span> <strong>hasta</strong> <span id="end-date">24 nov</span>
                    </span>
                  </span>

                  <div className="card-price">
                    <span>Precio:</span> <strong>$<span id="price">5.000</span></strong>
                  </div>
                </div>

                <div className="card-body">
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                </div>

                <div className="card-body">
                  <div className="name-card">
                    <h3>Fest</h3>
                  </div>
                  <p className="card-text">
                    Some quick example text to build on the card title and make up the bulk of the card's content.
                  </p>
                </div>
              </button>
            ))}
          </div>
        </article>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h4 className="footer-title">Acerca de Nosotros</h4>
              <p>
                Somos una empresa dedicada a ofrecer soluciones innovadoras en [tu área de negocio]. Nuestra
                misión es [tu misión].
              </p>
              <ul className="list-unstyled">
                <li><a href="#">Conócenos</a></li>
                <li><a href="#">Nuestro equipo</a></li>
                <li><a href="#">Trabaja con nosotros</a></li>
              </ul>
            </div>

            <div className="col-md-4">
              <h4 className="footer-title">Servicios</h4>
              <ul className="list-unstyled">
                <li><a href="#">[Servicio 1]</a></li>
                <li><a href="#">[Servicio 2]</a></li>
                <li><a href="#">[Servicio 3]</a></li>
              </ul>
            </div>

            <div className="col-md-4">
              <h4 className="footer-title">Contacto</h4>
              <ul className="list-unstyled">
                <li>
                  {/* geo */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                  </svg>{" "}
                  Direccion
                </li>
                <li>
                  {/* teléfono (ojo: fill-rule → fillRule en TSX) */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                    />
                  </svg>{" "}
                  +569-12345678
                </li>
                <li>
                  {/* mail */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill="currentColor" className="bi bi-envelope-at-fill" viewBox="0 0 16 16">
                    <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
                    <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034z" />
                  </svg>{" "}
                  correo@gmail.com
                </li>
              </ul>

              {/* Estos <i> requieren Font Awesome; ver nota abajo */}
              <ul className="list-inline">
                <li className="list-inline-item"><a href="#"><i className="fab fa-facebook-f" /></a></li>
                <li className="list-inline-item"><a href="#"><i className="fab fa-twitter" /></a></li>
                <li className="list-inline-item"><a href="#"><i className="fab fa-instagram" /></a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} [Tu empresa]. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
