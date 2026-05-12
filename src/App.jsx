import { useState } from "react";
import "./App.css";

export default function App() {
  const [wylosowanaLiczba, setWylosowanaLiczba] = useState(0)
  const [liczbyPoza, setLiczbyPoza] = useState([])
  const [liczbyW, setLiczbyW] = useState([])
  const [historiaLosowan, setHistoriaLosowan] = useState([])
  const [stanPrzyciskuAutoUsuwania, setStanPrzyciskuAutoUsuwania] = useState(false)

  // Dodaje do tablicy liczbyW podaną wartość
  const dodajLiczbeW = (wartosc) =>{
    const temp = [...liczbyW]
    temp.push(wartosc)
    setLiczbyW(temp)
  }

  // Dodaje do tablicy liczbyPoza podaną wartość
  const dodajLiczbePoza = (wartosc) => {
    const temp = [...liczbyPoza]
    temp.push(wartosc)
    setLiczbyPoza(temp)
  }

  // Dodaje do tablicy historiaLosowan podaną wartość
  const dodajDoHistoriiLosowan = (wartosc) => {
    const temp = [...historiaLosowan]
    temp.push(wartosc)
    setHistoriaLosowan(temp)
  }

  // Pobiera stan tablicy liczbyW
  // Funkcja typowo pomocnicza
  // Ustawia tablice liczbyW na podstawowy stan (od zakresu lewego do prawego)
  // Gdy jest szukana zmienna i stanPrzyciskuAutoUsuwania: powoduje ze aktualna liczba wylosowana jest wyrzucana od razu
  // I usuwa z tej tablicy wszystkie liczby, ktore sa w tablicy liczbyPoza
  const pobierzStanLiczbW = (
    zakresLewy = parseInt(document.getElementById("zakresLewyInput").value), 
    zakresPrawy = parseInt(document.getElementById("zakresPrawyInput").value),
    szukana = -1,
  ) => {
    const temp = [...liczbyPoza]
    const temp2 = []
    for(let i = zakresLewy; i <= zakresPrawy; i++){
      if(temp.includes(i) || (stanPrzyciskuAutoUsuwania == true && i == szukana)){
        continue
      }
      temp2.push(i)
    }
    return temp2
  }

  // Sortuje tablice daną w zmiennej rosnąco
  const posortujTablice = (tab) => {
    const temp = [...tab]
    return temp.sort((a, b) => a - b)
  }

  // Obsluguje przycisk sortowania
  const obsluzPrzyciskSortowania = (e) => {
    e.preventDefault()

    // Sortuje liczbyW
    let temp = [...liczbyW]
    temp = posortujTablice(temp)
    setLiczbyW(temp)

    // Sortuje liczbyPoza
    temp = [...liczbyPoza]
    temp = posortujTablice(temp)
    setLiczbyPoza(temp)
  }

  // Obsluguje przycisk dodaj
  const obsluzPrzyciskDodaj = (e) => {
    e.preventDefault()

    // Pobiera liczbe do usuniecia z zakresu
    const liczba = parseInt(document.getElementById("liczbaPozaZakresem").value)

    // Sprawdza czy już ta liczba była wyrzucona manualnie i czy wogole sie miesci w zakresie
    if(liczbyPoza.includes(liczba) || liczba < parseInt(document.getElementById("zakresLewyInput").value) || liczba > parseInt(document.getElementById("zakresPrawyInput").value)){
      alert("Ta liczba jest już poza zakresem")
      return
    }

    // Ustawia liczbyPoza i LiczbyW
    dodajLiczbePoza(liczba)
    const temp2 = pobierzStanLiczbW()
    setLiczbyW(temp2)
  }

  // Obsluguje przycisk usun
  const obsluzPrzyciskUsun = (e,element) => {
    e.preventDefault()

    // Filtruje liczby poza zakresem i zostawia wszystkie oprocz szukanego
    const temp = liczbyPoza.filter(currentElement => currentElement != element)

    // Zmiena liczbyPoza na nowa wartosc
    setLiczbyPoza(temp)

    // Dodaje do liczbyW element usuniety z liczb poza zakresem
    const temp2 = [...liczbyW]
    temp2.push(element) 
    setLiczbyW(temp2)
  }

  // Obsluguje przycisk losuj
  const obsluzPrzyciskLosuj = (e) => {
    e.preventDefault()

    // Pobiera zakres lewy i prawy
    const zakresLewy = parseInt(document.getElementById("zakresLewyInput").value)
    const zakresPrawy = parseInt(document.getElementById("zakresPrawyInput").value)

    // Sprawdza czy zakresy nie mają miedzy sobą konfliktu
    if(zakresPrawy < zakresLewy){
      alert("Zakres prawy jest mniejszy od lewego!");
      return;
    }
    if(zakresLewy > zakresPrawy){
      alert("Zakres lewy jest większy od prawego!");
      return;
    }

    // Losuje liczbe
    let wynik = Math.floor(Math.random() * zakresPrawy) + zakresLewy
    let temp = [...liczbyPoza]
    
    // Sprawdza czy ta liczba nie jest w liczbach poza zakresem
    while(temp.includes(wynik)){
      wynik = Math.floor(Math.random() * zakresPrawy) + zakresLewy // jezeli jest to losuje ponownie
    }

    // Ustawoa wylosowaną liczbe i zapisuje ja do historii
    setWylosowanaLiczba(wynik)
    dodajDoHistoriiLosowan(wynik)
    
    // Sprawdza czy wlaczone jest usuwanie z zakresu po losowaniu
    if(stanPrzyciskuAutoUsuwania){
      dodajLiczbePoza(wynik) // jezeli tak to daje ta liczbe do liczb z poza
    }

    // Aktualizuje tablice liczbyW
    const temp2 = pobierzStanLiczbW(zakresLewy,zakresPrawy,wynik)
    setLiczbyW(temp2)
  }

  // Obsluguje Przycisk Usuwania Automatycznego
  const obsluzPrzyciskUsuwanieAutomatyczne = (e) => {
    e.preventDefault()
    
    // Zmienia stan na jego przeciwienstwo
    setStanPrzyciskuAutoUsuwania(!stanPrzyciskuAutoUsuwania)
  }
  
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <span className="app-title">Generator Liczb Pseudolosowych</span>
      </header>


      <main className="layout">


        {/* ── LEWA KOLUMNA ── */}
        <section className="panel panel--left">
          <h2 className="panel__heading">historia losowań</h2>
          <ul className="number-list">
            {
              // Sprawdza czy jest jakaś wartość w historii losowań, jeżeli jest zwraca liste historii, jeżeli nie to wyświetla komunikat brak losowań
              historiaLosowan.length == 0 ? <li>Nie wylosowano jeszcze liczby</li> :
              historiaLosowan.map(element =>
                <li key={`historia_${element}`} className="number-list__item">{element}</li>
              ) 
            }
          </ul>
        </section>


        {/* ── ŚRODKOWY PANEL ── */}
        <form>
        <section className="panel panel--center">
          <div className="range-row">
            <div className="range-field">
              <label className="range-label">zakres lewy domknięty</label>
              <input id="zakresLewyInput" className="input input--range" type="number" placeholder="0" />
            </div>
            <div className="range-field">
              <label className="range-label">zakres prawy domknięty</label>
              <input id="zakresPrawyInput" className="input input--range" type="number" placeholder="100" />
            </div>
          </div>
          <div className="center-body">
            <div className="sub-panel">
              <h3 className="sub-panel__heading">Liczby pozostałe w zakresie</h3>
              <ul className="number-list number-list--compact">
                {
                  // Sprawdza czy jest jakaś wartość w liczbyW, jeżeli jest zwraca liste liczb w zbiorze, jeżeli nie to wyświetla komunikat brak losowań
                  liczbyW.length == 0 ? <li>Nie wylosowano jeszcze liczby</li> :
                  liczbyW.map(element =>
                    <li key={`wyswietlW_${element}`} className="number-list__item">{element}</li>
                  )
                }
              </ul>
            </div>
            <div className="draw-panel">
              <button className="btn btn--draw" onClick={() => obsluzPrzyciskLosuj(event)}>Losuj</button>
              <div className="drawn-number">{wylosowanaLiczba}</div>
              <span className="drawn-label">liczba wylosowana</span>
            </div>
            <div className="sub-panel">
              <h3 className="sub-panel__heading">Liczby wyjęte z zakresu</h3>
              <ul className="number-list number-list--compact">
                {
                  // Sprawdza czy jest jakaś wartośc w liczbach poza zakresem, jeżeli jest zwraca liste liczb z poza zakresu, jeżeli nie to wyświetla komunikat brak liczb z poza zakresu
                  liczbyPoza.length == 0 ? <li>Nie wyjęto jeszcze liczby z zakresu</li> :
                  liczbyPoza.map(element =>
                    <li key={`wyswietlPoza_${element}`} className="number-list__item">{element}</li>
                  )
                }
              </ul>
            </div>
          </div>
          <footer className="center-footer">
            <span className="watermark">© 2026 Wiktor Pietrucha</span>
          </footer>
        </section>
        </form>


        {/* ── PRAWA KOLUMNA ── */}
        <form>
        <section className="panel panel--right">
        <h2 className="panel__heading">automatyczne usuwanie liczby</h2>
        <div className="add-row">
          <button className="btn btn--accent" style={{width: 100 + "%",  height: "6vh", backgroundColor: stanPrzyciskuAutoUsuwania ? "#a03b45" : "#53fd61"}} onClick={() => obsluzPrzyciskUsuwanieAutomatyczne(event)}>{stanPrzyciskuAutoUsuwania ? "wyłącz" : "włącz"}</button>
        </div>
        </section>
        <section className="panel panel--right" style={{marginTop: 1 + 'em'}}>
        <h2 className="panel__heading">sortowanie liczb</h2>
        <div className="add-row">
          <button className="btn btn--accent" style={{width: 100 + "%", height: "6vh", backgroundColor: "hsl(189, 100%, 50%)"}} onClick={() => obsluzPrzyciskSortowania(event)}>sortuj</button>
        </div>
        </section>
        <section className="panel panel--right" style={{marginTop: 1 + 'em'}}>
          <h2 className="panel__heading">Liczby wyjęte z zakresu</h2>
          <div className="add-row">
            <input id="liczbaPozaZakresem" className="input" type="number" placeholder="LICZBA" />
            <button className="btn btn--accent" onClick={() => obsluzPrzyciskDodaj(event)}>dodaj</button>
          </div>
          <ul className="number-list">
            {
              liczbyPoza.map(element =>
                <li key={`usun_${element}`} className="number-list__item number-list__item--removable">
                  <span>{element}</span>
                  <button className="btn btn--remove" onClick={() => obsluzPrzyciskUsun(event,element)}>Usuń</button>
                </li>
              )
            }
          </ul>
        </section>
        </form>


      </main>
    </div>
  );
}