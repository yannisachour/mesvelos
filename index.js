/*
 HTTP Cloud Function.
 @param {Object} req Cloud Function request context.
 @param {Object} res Cloud Function response context.
*/
'use strict';
const http = require('http');
const DomParser = require('dom-parser');
const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
var request = require('request');


const host = "www.lemonde.fr"
const category_paths = {
    "A la une": "/rss/une.xml",
    "Les vidéos": "/videos/rss_full.xml",
    "Actu": "/m-actu/rss_full.xml",
    "Afrique": "/afrique/rss_full.xml",
    "Amériques": "/ameriques/rss_full.xml",
    "Argent & Placements": "/argent/rss_full.xml",
    "Asie-Pacifique": "/asie-pacifique/rss_full.xml",
    "Attentat de Manchester": "/attentat-de-manchester/rss_full.xml",
    "Bac": "/bac-lycee/rss_full.xml",
    "Bachelor": "/bachelor/rss_full.xml",
    "Brevet des collèges": "/brevet-college/rss_full.xml",
    "Brésil 2014": "/coupe-du-monde/rss_full.xml",
    "Campus": "/campus/rss_full.xml",
    "Crise financière": "/crise-financiere/rss_full.xml",
    "Culture": "/culture/rss_full.xml",
    "Disparitions": "/disparitions/rss_full.xml",
    "Documents WikiLeaks": "/documents-wikileaks/rss_full.xml",
    "Ecoles d'ingénieurs": "/ingenieurs-sciences/rss_full.xml",
    "Elections Régionales": "/elections-regionales/rss_full.xml",
    "Elections italiennes 2013": "/elections-italiennes/rss_full.xml",
    "Elections régionales 2015": "/elections-regionales-2015/rss_full.xml",
    "Emploi": "/emploi/rss_full.xml",
    "En bref": "/en-bref/rss_full.xml",
    "Enseignement supérieur": "/enseignement-superieur/rss_full.xml",
    "Etudier à l'étranger": "/partir-a-l-etranger/rss_full.xml",
    "Eté": "/ete/rss_full.xml",
    "Euro 2012": "/euro2012/rss_full.xml",
    "Europe": "/europe/rss_full.xml",
    "Festival de Cannes": "/festival-de-cannes/rss_full.xml",
    "Finances": "/finance/rss_full.xml",
    "Flottes d'entreprise": "/flottes-d-entreprise/rss_full.xml",
    "Football": "/football/rss_full.xml",
    "Françaises, Français": "/francaises-francais/rss_full.xml",
    "Idées": "/idees/rss_full.xml",
    "Immobilier": "/immobilier/rss_full.xml",
    "International": "/international/rss_full.xml",
    "Japon": "/japon/rss_full.xml",
    "Jeux olympiques": "/jeux-olympiques/rss_full.xml",
    "Jeux vidéo": "/jeux-video/rss_full.xml",
    "L'époque": "/m-perso/rss_full.xml",
    "La France insoumise": "/la-france-insoumise/rss_full.xml",
    "La République en marche": "/la-republique-en-marche/rss_full.xml",
    "Les décodeurs": "/les-decodeurs/rss_full.xml",
    "Libye": "/libye/rss_full.xml",
    "Livres": "/livres/rss_full.xml",
    "M le mag": "/m-le-mag/rss_full.xml",
    "Masters et Mastères spécialisés": "/masters-ms/rss_full.xml",
    "Mobilité": "/mobilite/rss_full.xml",
    "Monde Académie": "/monde-academie/rss_full.xml",
    "Mort de Ben Laden": "/mort-de-ben-laden/rss_full.xml",
    "Municipales 2014": "/municipales/rss_full.xml",
    "Médias": "/actualite-medias/rss_full.xml",
    "Orientation scolaire": "/orientation-scolaire/rss_full.xml",
    "Panama Papers": "/panama-papers/rss_full.xml",
    "Paris": "/paris/rss_full.xml",
    "Paris Style": "/paris-style/rss_full.xml",
    "Partenaires": "/partenaires/rss_full.xml",
    "Pixels": "/pixels/rss_full.xml",
    "Planète": "/planete/rss_full.xml",
    "Politique": "/politique/rss_full.xml",
    "Primaire parti socialiste": "/primaire-parti-socialiste/rss_full.xml",
    "Proche-Orient": "/proche-orient/rss_full.xml",
    "Radiozapping": "/radios/rss_full.xml",
    "Roland-Garros": "/roland-garros/rss_full.xml",
    "Rétrospective": "/retrospective/rss_full.xml",
    "Santé": "/sante/rss_full.xml",
    "Sciences": "/sciences/rss_full.xml",
    "Sciences Po": "/droit-sciences-po/rss_full.xml",
    "Société": "/societe/rss_full.xml",
    "Sport": "/sport/rss_full.xml",
    "Styles": "/m-styles/rss_full.xml",
    "Technologies": "/technologies/rss_full.xml",
    "Tour de France": "/tour-de-france/rss_full.xml",
    "Trajectoires digitales": "/trajectoires-digitales/rss_full.xml",
    "Télézapping": "/tele-zapping/rss_full.xml",
    "Une Mobile": "/une-mobile/rss_full.xml",
    "Universités": "/universites/rss_full.xml",
    "Web étudiant": "/moocs-docs/rss_full.xml",
    "École primaire et secondaire": "/ecole-primaire-et-secondaire/rss_full.xml",
    "Écoles de journalisme": "/ecoles-de-journalisme/rss_full.xml",
    "Économie": "/economie/rss_full.xml",
    "Élection présidentielle 2012": "/election-presidentielle-2012/rss_full.xml",
    "Élections américaines": "/elections-americaines/rss_full.xml",
    "Études sup": "/etudes-superieures/rss_full.xml"
};

exports.getVelodisp = (req, res) => {
    let category = req.body.result.parameters['Categories'];
    getArticle(category).then((output) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
};

exports.getVelos = (req, res) => {
    console.log(`ici on passe`);
    let station = '7011';
    getVelibReq(station).then((output) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });

    callback();
};

var getVelibReq = function (station) {
    return new Promise((resolve, reject) => {

        var options = {
            method: 'GET',
            url: 'https://api.jcdecaux.com/vls/v1/stations/7011',
            qs:
                {
                    contract: 'Paris',
                    apiKey: '6fc977ef817faeb2d8e6ea367a837ad383433579'
                },
            headers:
                {
                    accept: 'application/json'
                }
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);

            resolve(response);
            console.log(body);
            console.log(body.available_bikes);
        });

    });
}


var getArticle = function (category) {
    return new Promise((resolve, reject) => {
        http.get({ host: host, path: category_paths[category] }, (rssResponse) => {
            let body = '';
            rssResponse.on('data', (d) => { body += d; }); // store each response chunk
            rssResponse.on('end', () => {
                var parser = new DomParser();
                var xmlDoc = parser.parseFromString(body, "text/xml");
                var title = "";
                var title = entities.decode(xmlDoc.getElementsByTagName("channel")[0].getElementsByTagName("item")[0].getElementsByTagName("title")[0].textContent);
                var response = "Le dernier article du dans la catégorie \"" + category + "\" a pour titre " + title;
                resolve(response);
            });
            rssResponse.on('error', (error) => {
                reject(error);
            });
        });
    });
}

