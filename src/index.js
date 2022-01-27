const express = require("express");
const axios = require("axios");
const { json } = require("express");
require("dotenv").config();
var request = require('request');
const fs = require('fs');
const app = express();
var jsonFile = require('./local.json');
var usersFile = require('./users.json');


app.listen(3333);


app.get('/', async(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.send('hello world');
})


app.post('/summoner/:summoner', async(req, res)=>{
    res.header("Access-Control-Allow-Origin", "*");

    const { summoner } = req.params;
    let user = await axios({
        method : 'get',
        baseURL: `${process.env.LOL_URL}/lol/summoner/v4/summoners/by-name/${summoner}`,
        headers: {'X-Riot-Token': process.env.LOL_KEY}
    }).then((res)=>{
        //console.log(res.data);
        return res.data;
    })
    let summonerInfo = await axios({
        method : 'get',
        baseURL: `${process.env.LOL_URL}/lol/league/v4/entries/by-summoner/${user.id}`,
        headers: {'X-Riot-Token': process.env.LOL_KEY}
    }).then((res)=>{
        //console.log(res.data);
        return res.data;
    })
    let Icons = await axios({
        method : 'get',
        baseURL: `https://ddragon.leagueoflegends.com/api/versions.json`,
    }).then((res)=>{
        //console.log(res.data);
        return res.data;
    })
    console.log(summonerInfo[0]);
    let icons = Icons[0];
    const { profileIconId, name } = user; 
    

    if(summonerInfo[0] == undefined){
        res.json({
            profileIconId,
            name,
            icons
        }); 
    }else{
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
