import styles from "./home.module.css";
import { FormEvent, useEffect, useState, } from "react";

import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

// https://coinlib.io/api/v1/coinlist?key=ed25652a6ce4bc0e

// ed25652a6ce4bc0e



interface coinProps{
    name: string,
    delta_24h: string,
    price: string,
    symbol: string,
    volume_24h: string,
    market_cap: string,
    formatedPrice: string,
    formatedMarket: string,

}


interface DataProps{
    coins: coinProps[],
}

export function Home(){

    const [coins, setCoins] = useState<coinProps[]>([]);
    const [inputValue, setInputValue] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        function getData(){
            fetch("https://sujeitoprogramador.com/api-cripto/?key=ed25652a6ce4bc0e")
            .then(response => response.json())
            .then((data: DataProps) => {
                const coinsData = data.coins.slice(0, 15);

                const price = Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                })

                const formatResults = coinsData.map((item) => {
                    const formated = {
                        ...item,
                        formatedPrice: price.format(Number(item.price)),
                        formatedMarket: price.format(Number(item.market_cap))
                    }
                    return formated;
                })



                setCoins(formatResults);
            })
        }

        getData();

    }, [])

    function handleSearch(e: FormEvent){
        e.preventDefault();
        if(inputValue === "") return;
        navigate(`/detail/${inputValue}`)
    }




    return(
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSearch}>
                <input
                    placeholder="Digite o simbolo da moeda: BTC..."
                    value={inputValue}
                    onChange={ (e) => setInputValue(e.target.value)}
                />

                <button type="submit">
                    <BiSearch size={30} color='#FFF'/>
                </button>
            </form>


            <table>
                <thead>
                    <th scope="col">Moeda</th>
                    <th scope="col">Valor Mercado</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Volume</th>
                    
                </thead>

                <tbody id="tbody">
                    {coins.map(coin =>(
                        <tr className={styles.tr} key={coin.name}>
                            <td className={ styles.tdlabel} data-label="Moeda" >
                                <Link to={`/detail/${coin.symbol}`}  className={styles.link}>
                                    <span>{coin.name}</span> | {coin.symbol}
                                </Link>
                            </td>
                    
                            <td className={ styles.tdlabel} data-label="Valor Mercado">
                                {coin.formatedMarket}
                            </td>
                                           
                            <td className={ styles.tdlabel} data-label="Preço">
                                 {coin.formatedPrice}
                            </td>
                    
                            <td className={Number(coin?.delta_24h.replace(",", ".")) >= 0 ? styles.tdprofit : styles.tdloss} data-label="Volume">
                                <span>{coin.delta_24h}</span>
                            </td>
                    
                        </tr>

                    ))}

                </tbody>

            </table>










        </main>
    )
}