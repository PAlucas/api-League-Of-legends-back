const express = require("express");
const axios = require("axios");
const { json } = require("express");
require("dotenv").config();//informações para o header, url para facilitar o processo de pegar informações.
const app = express();


app.listen("https://react-lol-api.herokuapp.com/");

app.post('/summoner/:summoner', async(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    //Pegar as informações básicas tipo os ids para pegarem mais informações
    const { summoner } = req.params;
    let user = await axios({
        method : 'get',
        baseURL: `${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${summoner}`,
        headers: {'X-Riot-Token': process.env.LOL_KEY}
    }).then((res)=>{
        return res.data;
    })
    //Pegar as informações mais elaboradas tipo quantidade de vitórias ranked
    let summonerInfo = await axios({
        method : 'get',
        baseURL: `${process.env.LOL_URL}/lol/league/v4/entries/by-summoner/${user.id}`,
        headers: {'X-Riot-Token': process.env.LOL_KEY}
    }).then((res)=>{
        return res.data;
    })
    //Pegar a versão que está o ícone
    let Icons = await axios({
        method : 'get',
        baseURL: `https://ddragon.leagueoflegends.com/api/versions.json`,
    }).then((res)=>{
        return res.data;
    })
    
    let icons = Icons[0];
    
    //Pegar as informações da variável user.
    const { profileIconId, name } = user; 
    
    //if para montar um json com as informações organizadas para ser mandado para o front end
    if(summonerInfo[0] == undefined){
        res.json({
            profileIconId,
            name,
            icons
        }); 
    }else{
        //Pegar as informações da variável summerInfo
        const { tier, rank, wins, losses, queueType } = summonerInfo[0];
        res.json({
            profileIconId,
            tier,
            rank,
            wins,
            losses,
            queueType,
            name,
            icons
        });
    }
    
})
