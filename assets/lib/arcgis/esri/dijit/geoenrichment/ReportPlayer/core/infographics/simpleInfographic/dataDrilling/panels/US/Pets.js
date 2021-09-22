// All material copyright ESRI, All Rights Reserved, unless otherwise specified.
// See http://js.arcgis.com/3.32/esri/copyright.txt for details.
//>>built
define("esri/dijit/geoenrichment/ReportPlayer/core/infographics/simpleInfographic/dataDrilling/panels/US/Pets",["../../ChartBuilder","../../../../../charts/utils/ChartTypes"],function(b,c){var a={};a.hhOnwsAnyPet={states:"n,p,i",defaultState:"p",stateSettings:{n:{yAxisTitle:"Number of households"},p:{yAxisTitle:"Percent of households"}},fieldInfo:{isChart:!0,chartJson:b.createChart({type:c.COLUMN,title:"Households: Own Any Pet",points:[{label:"Pet",fullName:"AtRisk.MP26001h_B"},{label:"Cat",fullName:"PetsPetProducts.MP26003h_B"},
{label:"Dog",fullName:"PetsPetProducts.MP26004h_B"}],visualProps:{sorting:"Descending"}})}};a.dogProducts={states:"n,p,i",defaultState:"i",stateSettings:{n:{yAxisTitle:"Number of households"},p:{yAxisTitle:"Percent of households"}},fieldInfo:{isChart:!0,chartJson:b.createChart({title:"Dog Products",points:[{label:"Canned/wet dog food in last 6 mos",fullName:"PetsPetProducts.MP26019h_B"},{label:"Packaged dry dog food in last 6 mos",fullName:"PetsPetProducts.MP26022h_B"},{label:"Dog biscuits/treats in last 6 mos",
fullName:"PetsPetProducts.MP26025h_B"},{label:"Flea/tick/parasite product for cat/dog",fullName:"PetsPetProducts.MP26027h_B"}],visualProps:{sorting:"Descending"}})}};a.catProducts={states:"n,p,i",defaultState:"i",stateSettings:{n:{yAxisTitle:"Number of households"},p:{yAxisTitle:"Percent of households"}},fieldInfo:{isChart:!0,chartJson:b.createChart({title:"Cat Products",points:[{label:"Canned/wet cat food in last 6 mos",fullName:"PetsPetProducts.MP26009h_B"},{label:"Packaged dry cat food in last 6 mos",
fullName:"PetsPetProducts.MP26012h_B"},{label:"Cat treats in last 6 mos",fullName:"PetsPetProducts.MP26015h_B"},{label:"Cat litter in last 6 mos",fullName:"PetsPetProducts.MP26017h_B"},{label:"Flea/tick/parasite product for cat/dog",fullName:"PetsPetProducts.MP26027h_B"}],visualProps:{sorting:"Descending"}})}};return a});