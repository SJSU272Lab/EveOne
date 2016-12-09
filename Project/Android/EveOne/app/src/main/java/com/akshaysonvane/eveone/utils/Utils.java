package com.akshaysonvane.eveone.utils;

/**
 * Created by Akshay on 11/28/2016.
 */

public class Utils
{
    private static Utils utils = null;
    public String base_url = "https://eveone.herokuapp.com/parentLogin.html";

    public static Utils getInstance()
    {
        if (utils == null)
        {
            utils = new Utils();
        }

        return utils;
    }
}
